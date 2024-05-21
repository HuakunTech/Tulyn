<script>
  import "./app.css";
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import Counter from "./lib/Counter.svelte";
</script>

<main>
  <h1>About</h1>
  <img src={svelteLogo} class="h-full logo svelte" alt="Svelte Logo" />
  <div class="card">
    <Counter></Counter>
  </div>
</main>
