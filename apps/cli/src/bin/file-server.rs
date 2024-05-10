use axum::{
    body::Body,
    extract::{Request, State},
    handler::HandlerWithoutStateExt,
    http::uri::Uri,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use hyper_util::{client::legacy::connect::HttpConnector, rt::TokioExecutor};
use std::{net::SocketAddr, path::PathBuf};
use tower::ServiceExt;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
type Client = hyper_util::client::legacy::Client<HttpConnector, Body>;

async fn rev_proxy(State(client): State<Client>, mut req: Request) -> Result<Response, StatusCode> {
    let path = req.uri().path();
    println!("path: {}", path);
    // let path_query = req
    //     .uri()
    //     .path_and_query()
    //     .map(|v| v.as_str())
    //     .unwrap_or(path);
    let ext_root = PathBuf::from("/Users/hacker/Dev/projects/Jarvis/dev/extensions");
    // remove prefix
    let path = path.trim_start_matches("/ext");
    println!("path: {}", path);
    let extension_name = path.split('/').nth(1).unwrap();
    println!("extension_name: {}", extension_name);
    let file_to_serve = ext_root
        .join(extension_name)
        .join("dist")
        .join("index.html");
    let serve = ServeFile::new(file_to_serve);
    let uri = format!("http://127.0.0.1:1566/extensions/{extension_name}/dist");
    // let uri = format!("{}/{}", uri, path);
    *req.uri_mut() = Uri::try_from(uri).unwrap();
    // println!("uri: {}", uri);
    // let response = serve
    //     .oneshot(req)
    //     .await
    //     .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    // return Ok(response);

    Ok(client
        .request(req)
        .await
        .map_err(|_| StatusCode::BAD_REQUEST)?
        .into_response())
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_static_file_server=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
    let client: Client =
        hyper_util::client::legacy::Client::<(), ()>::builder(TokioExecutor::new())
            .build(HttpConnector::new());

    let route = Router::new()
        .nest_service(
            "/",
            ServeDir::new("/Users/hacker/Dev/projects/Jarvis/dev"),
            // ServeDir::new("/Users/hacker/Dev/projects/Jarvis/dev/extensions"),
        )
        // .route("/*extensions", get(rev_proxy))
        .route("/ext/*path", get(rev_proxy))
        .with_state(client);
    let addr = SocketAddr::from(([127, 0, 0, 1], 1566));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, route.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}
