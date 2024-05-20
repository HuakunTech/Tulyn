<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  let count = 0;
</script>

<div class="flex flex-col justify-center items-center h-screen space-y-5">
  <h1 class="text-3xl">SvelteKit Extension Template for Jarvis</h1>
  <p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
  </p>
  <Button on:click={() => count++}>Increment: {count}</Button>
</div>
