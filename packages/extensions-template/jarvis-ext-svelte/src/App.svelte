<script>
  import "./app.css";
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";
  import { ModeWatcher } from "mode-watcher";
</script>

<main class="h-screen">
  <div
    class="flex flex-col space-y-5 items-center justify-center h-full"
  >
    <ModeWatcher />
    <div class="flex m-10 space-x-10">
      <a
        href="https://vitejs.dev"
        target="_blank"
        rel="noreferrer"
        class="w-40 h-40"
      >
        <img src={viteLogo} class="h-full logo" alt="Vite Logo" />
      </a>
      <a
        href="https://svelte.dev"
        target="_blank"
        rel="noreferrer"
        class="w-40 h-40"
      >
        <img src={svelteLogo} class="h-full logo svelte" alt="Svelte Logo" />
      </a>
    </div>
    <h1 class="text-3xl">Svelte Extension Template for Jarvis</h1>

    <div class="card">
      <Counter></Counter>
    </div>

    <p>
      Check out <a
        href="https://github.com/sveltejs/kit#readme"
        target="_blank"
        rel="noreferrer">SvelteKit</a
      >, the official Svelte app framework powered by Vite!
    </p>

    <p class="read-the-docs">
      Click on the Vite and Svelte logos to learn more
    </p>
  </div>
</main>
