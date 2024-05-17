use std::net::SocketAddr;

use axum::Router;
use tower_http::services::ServeDir;

fn main() {
    let static_service = ServeDir::new("/Users/hacker/Dev/projects/Jarvis/dev");
    let http: Router = Router::new().nest_service(
        "/",
        static_service,
        // ServeDir::new("/Users/hacker/Dev/projects/Jarvis/dev/extensions"),
    );
    // let addr = SocketAddr::from(([127, 0, 0, 1], 1566));
    // axum::Server::bind(&addr)
    //     // .serve(grpc_router.into_make_service())
    //     .await
    //     .unwrap();
}
