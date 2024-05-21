<script>
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
</script>

<main>
  <Toaster />
  <ModeWatcher />
  <slot />
</main>
