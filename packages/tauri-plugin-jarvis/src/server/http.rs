use super::grpc::greeter::hello_world::greeter_server::GreeterServer;
use super::grpc::greeter::MyGreeter;
use super::Protocol;
/// This module is responsible for controlling the main server
use super::{
    model::ServerState,
    rest::{get_server_info, web_root},
};
use crate::utils::path::get_default_extensions_dir;
use axum::http::{HeaderValue, Method};
use axum::routing::get;
use axum_server::tls_rustls::RustlsConfig;
use std::sync::Mutex;
use std::{net::SocketAddr, path::PathBuf, sync::Arc};
use tauri::AppHandle;
use tonic::transport::Server as TonicServer;
use tower_http::{cors::CorsLayer, services::ServeDir};

struct ServerOptions {
    extension_folder: PathBuf,
    dev_extension_folder: Option<PathBuf>,
}

async fn start_server(
    protocol: Protocol,
    server_addr: SocketAddr,
    app_handle: AppHandle,
    shtdown_handle: axum_server::Handle,
    options: ServerOptions,
) -> Result<(), Box<dyn std::error::Error>> {
    let greeter = MyGreeter::default();
    let server_state = ServerState {
        app_handle: app_handle.clone(),
    };
    let reflection_service = tonic_reflection::server::Builder::configure()
        .register_encoded_file_descriptor_set(
            super::grpc::greeter::hello_world::FILE_DESCRIPTOR_SET,
        )
        .build()
        .unwrap();
    let grpc_router = TonicServer::builder()
        .add_service(reflection_service)
        .add_service(GreeterServer::new(greeter))
        .into_router();
    let mut rest_router = axum::Router::new()
        .route("/", get(web_root))
        .route("/info", get(get_server_info))
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET]),
        )
        .nest_service("/extensions", ServeDir::new(options.extension_folder))
        .with_state(server_state);
    if options.dev_extension_folder.is_some() {
        rest_router = rest_router.nest_service(
            "/dev-extensions",
            ServeDir::new(options.dev_extension_folder.unwrap()),
        );
    }
    let combined_router = axum::Router::new().merge(grpc_router).merge(rest_router);
    let svr = match protocol {
        Protocol::Http => {
            axum_server::bind(server_addr)
                .handle(shtdown_handle)
                .serve(combined_router.into_make_service())
                .await
        }
        Protocol::Https => {
            let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
            let tls_config = RustlsConfig::from_pem_file(
                manifest_dir.join("self_signed_certs").join("server.crt"),
                manifest_dir.join("self_signed_certs").join("server.key"),
            )
            .await?;
            axum_server::bind_rustls(server_addr, tls_config)
                .handle(shtdown_handle)
                .serve(combined_router.into_make_service())
                .await
        }
    };
    Ok(svr?)
}

pub struct Server {
    pub app_handle: AppHandle,
    pub shtdown_handle: Arc<Mutex<Option<axum_server::Handle>>>,
    pub protocol: Mutex<Protocol>,
    pub port: u16,
    pub server_handle: Arc<std::sync::Mutex<Option<tauri::async_runtime::JoinHandle<()>>>>,
    pub extension_folder: Arc<Mutex<Option<PathBuf>>>,
    pub dev_extension_folder: Arc<Mutex<Option<PathBuf>>>,
}

impl Server {
    pub fn new(
        app_handle: AppHandle,
        port: u16,
        protocol: Protocol,
        ext_folder: Option<PathBuf>,
        dev_ext_folder: Option<PathBuf>,
    ) -> Self {
        Self {
            app_handle,
            protocol: Mutex::new(protocol),
            port,
            server_handle: Arc::new(std::sync::Mutex::new(None)),
            shtdown_handle: Arc::new(Mutex::new(None)),
            extension_folder: Arc::new(Mutex::new(ext_folder)),
            dev_extension_folder: Arc::new(Mutex::new(dev_ext_folder)),
        }
    }

    pub async fn set_server_protocol(&self, protocol: Protocol) {
        let mut p = self.protocol.lock().unwrap();
        *p = protocol;
    }

    pub fn start(&self) -> Result<(), Box<dyn std::error::Error>> {
        let mut server_handle = self.server_handle.lock().unwrap();
        let mut shtdown_handle = self.shtdown_handle.lock().unwrap();
        if server_handle.is_some() {
            return Err("Server is already running".into());
        }
        let server_addr: SocketAddr = format!("[::]:{}", self.port).parse()?;
        let app_handle = self.app_handle.clone();
        let _shutdown_handle = axum_server::Handle::new();
        *shtdown_handle = Some(_shutdown_handle.clone());
        let protocol = self.protocol.lock().unwrap().clone();

        let mut ext_folder = self.extension_folder.lock().unwrap();
        let extension_folder = match ext_folder.to_owned() {
            Some(extension_folder) => extension_folder,
            None => {
                let path =
                    get_default_extensions_dir(&app_handle).map_err(|err| err.to_string())?;
                *ext_folder = Some(path.clone());
                path
            }
        };
        let dev_extension_folder = self.dev_extension_folder.lock().unwrap().to_owned();

        *server_handle = Some(tauri::async_runtime::spawn(async move {
            match start_server(
                protocol,
                server_addr,
                app_handle,
                _shutdown_handle,
                ServerOptions {
                    extension_folder,
                    dev_extension_folder,
                },
            )
            .await
            {
                Ok(_) => {}
                Err(e) => {
                    eprintln!("Server start error: {}", e);
                }
            }
        }));
        Ok(())
    }

    pub fn stop(&self) -> Result<(), Box<dyn std::error::Error>> {
        let mut server_handle = self.server_handle.lock().unwrap();
        let mut shtdown_handle = self.shtdown_handle.lock().unwrap();
        match shtdown_handle.as_ref() {
            Some(handle) => {
                handle.shutdown();
            }
            None => {
                return Err("Server is not running".into());
            }
        }
        shtdown_handle.take();
        // self.shutdown_tx.send(())?;
        server_handle.take();
        Ok(())
    }

    pub fn is_running(&self) -> bool {
        self.server_handle.lock().unwrap().is_some()
            && self.shtdown_handle.lock().unwrap().is_some()
    }
}
