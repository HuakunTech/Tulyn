use axum::ServiceExt;
// use axum::{handler::HandlerWithoutStateExt, http::StatusCode, routing::get, Router};
use helloworld::greeter_server::{Greeter, GreeterServer};
use helloworld::{HelloReply, HelloRequest};
use std::net::SocketAddr;
use std::path::PathBuf;
use tonic::{
    transport::Server as tonic_server, Request as GRPC_Request, Response as GRPC_Response, Status,
};
use tower::MakeService;
use tower_http::{services::ServeDir, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub mod helloworld {

    tonic::include_proto!("helloworld"); // The string specified here must match the proto package name
                                         // let descriptor_path = PathBuf::from("/Users/hacker/Dev/projects/Jarvis/apps/desktop/src-tauri/proto");
                                         // let descriptor_path = PathBuf::from(PathBuf::from(format!("/Users/hacker/Dev/projects/Jarvis/apps/desktop/src-tauri/proto")).join("my_descriptor.bin"));
    pub(crate) const FILE_DESCRIPTOR_SET: &[u8] =
        tonic::include_file_descriptor_set!("helloworld_descriptor");
}

// mod proto {
//     tonic::include_proto!("helloworld");

//     pub(crate) const FILE_DESCRIPTOR_SET: &[u8] =
//         tonic::include_file_descriptor_set!("helloworld_descriptor");
// }

#[derive(Debug, Default)]
pub struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello(
        &self,
        request: GRPC_Request<HelloRequest>, // Accept request of type HelloRequest
    ) -> Result<GRPC_Response<HelloReply>, Status> {
        // Return an instance of type HelloReply
        println!("Got a request: {:?}", request);

        let reply = helloworld::HelloReply {
            message: format!("Hello {}!", request.into_inner().name), // We must use .into_inner() as the fields of gRPC requests and responses are private
        };

        Ok(GRPC_Response::new(reply)) // Send back our formatted greeting
    }
}

pub async fn start_server() {
    // tracing_subscriber::registry()
    //     .with(
    //         tracing_subscriber::EnvFilter::try_from_default_env()
    //             .unwrap_or_else(|_| "example_static_file_server=debug,tower_http=debug".into()),
    //     )
    //     .with(tracing_subscriber::fmt::layer())
    //     .init();
    // let p = PathBuf::from(
    //     "/Users/hacker/Dev/projects/Jarvis/apps/desktop/src-tauri/proto/helloworld_descriptor.bin",
    // );
    // let bytes: &[u8] = &std::fs::read(p).unwrap();
    println!("bytes: {:?}", helloworld::FILE_DESCRIPTOR_SET.len());
    let reflection_service = tonic_reflection::server::Builder::configure()
        // .register_encoded_file_descriptor_set(bytes)
        .register_encoded_file_descriptor_set(helloworld::FILE_DESCRIPTOR_SET)
        .build()
        .unwrap();
    //     .into_make_service()
    // .into_service();
    let grpc_router = tonic_server::builder()
        .add_service(reflection_service)
        .add_service(GreeterServer::new(MyGreeter::default()))
        .into_router()
        .nest_service("/", ServeDir::new("/Users/hacker/Dev/projects/Jarvis/packages/"));
    let addr = SocketAddr::from(([127, 0, 0, 1], 1566));
    axum::Server::bind(&addr)
        // .serve(web_app.into_make_service())
        .serve(grpc_router.into_make_service())
        .await
        .expect("server failed");
}
