import "./app.css";
import App from "./Search.svelte";

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
