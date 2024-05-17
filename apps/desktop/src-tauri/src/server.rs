// use axum::{handler::HandlerWithoutStateExt, http::StatusCode, routing::get, Router};
use axum::{handler::HandlerWithoutStateExt, http::StatusCode, routing::get, Router};
use helloworld::greeter_server::{Greeter, GreeterServer};
use helloworld::{HelloReply, HelloRequest};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tonic::{
    transport::Server as tonic_server, Request as GRPC_Request, Response as GRPC_Response, Status,
};
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
pub mod helloworld {
    tonic::include_proto!("helloworld"); // The string specified here must match the proto package name
}

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
    // let grpc = Server::builder()
    //     .add_service(GreeterServer::new(MyGreeter))
    //     .into_service()
    //     .map_response(|r| r.map(axum::body::boxed))
    //     .boxed_clone();

    // let static_router: Router =
    //     Router::new().nest_service("/", ServeDir::new("/Users/hacker/Dev/projects/Jarvis/dev"));
    // let http_grpc = Steer::new(vec![http, grpc], |req: &GRPC_Request<Body>, _svcs: &[_]| {
    //     if req.headers().get(CONTENT_TYPE).map(|v| v.as_bytes()) != Some(b"application/grpc") {
    //         0
    //     } else {
    //         1
    //     }
    // });
    let grpc_router = tonic_server::builder()
        .add_service(GreeterServer::new(MyGreeter::default()))
        .into_router()
        .nest_service("/", ServeDir::new("/Users/hacker/Dev/projects/Jarvis/dev"));
    // .route("/", get(web_root));
    // println!("1566");
    // let handle = Handle::new();
    let addr = SocketAddr::from(([127, 0, 0, 1], 1566));
    axum::Server::bind(&addr)
        // .serve(web_app.into_make_service())
        .serve(grpc_router.into_make_service())
        .await.expect("server failed");
    // axum::Server::bind(&addr)
    //     .serve(grpc_router.into_make_service())
    //     .await.unwrap();
    // let server = axum_server::bind(addr)
    //     .handle(handle.clone())
    //     .serve(Shared::new(http_grpc));
    // tokio::spawn(server);

    // let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    // // tracing::debug!("listening on {}", listener.local_addr().unwrap());
    // axum::serve(listener, http.layer(TraceLayer::new_for_http()))
    //     .await
    //     .unwrap();
}
