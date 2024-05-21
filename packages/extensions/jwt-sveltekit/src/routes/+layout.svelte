<script>
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
</script>

<main>
  <Toaster />
  <ModeWatcher />
  <div class="data-tauri-drag-region h-screen flex flex-col">
    <div class="h-8" data-tauri-drag-region></div>
    <slot />
  </div>
</main>
