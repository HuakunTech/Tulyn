<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import QR from "$lib/components/QR.svelte";
  import QRCode from "easyqrcodejs";
  import { onMount } from "svelte";

  let url: string;
  let qrcode: QRCode | undefined;

  $: {
    console.log(url);
    if (url && qrcode) {
      if (qrcode) {
        // qrcode.clear();
        qrcode.makeCode(url);
      }
    }
  }

  onMount(async () => {
    const clipboardContent = await navigator.clipboard.readText();
    if (clipboardContent) {
      url = clipboardContent;
    }
  });
</script>

<div class="flex flex-col justify-center items-center h-screen space-y-5">
  <div class="flex w-96 space-x-2">
    <Input bind:value={url} type="text" placeholder="URL" class="max-w-xl" />
    <Button on:click={() => url && qrcode?.download("qrcode")}>Download</Button>
  </div>
  <div class="w-96">
    <QR bind:url bind:qrcode />
    {#if url}
      <div class="prose mt-3">
        <pre>{url}</pre>
      </div>
    {/if}
  </div>
</div>
