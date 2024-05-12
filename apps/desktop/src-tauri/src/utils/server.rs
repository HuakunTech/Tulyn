use axum::{
    extract::Request, handler::HandlerWithoutStateExt, http::StatusCode, routing::get, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower::ServiceExt;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub async fn start_server() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_static_file_server=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let route: Router =
        Router::new().nest_service("/", ServeDir::new("/Users/hacker/Dev/projects/Jarvis/dev"));
    let addr = SocketAddr::from(([127, 0, 0, 1], 1566));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, route.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}
