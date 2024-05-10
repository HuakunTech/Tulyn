import { invoke } from "@tauri-apps/api/tauri";

export function startServer() {
  return invoke("start_server");
}

export function stopServer() {
  return invoke("stop_server");
}

export function serverIsRunning() {
  return invoke("server_is_running");
}
