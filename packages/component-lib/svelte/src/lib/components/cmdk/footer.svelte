<script>
  import { cn } from "$lib/utils";
</script>

<div
  class={cn(
    "flex items-center w-full rounded-b-lg border-t-[1px] bottom-0 justify-between px-1"
  )}
>
  <slot />
</div>
