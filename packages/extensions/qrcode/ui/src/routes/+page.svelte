<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import QR from "$lib/components/QR.svelte";
  import QRCode from "easyqrcodejs";
  import { onMount } from "svelte";
  import { clipboard, fs, dialog } from "@jarvis/api-ui";
  import * as v from "valibot";
  import { ClipboardCopyIcon, DownloadIcon } from "lucide-svelte/icons";

  let url: string;
  let qrcode: QRCode | undefined;

  $: {
    if (url && qrcode) {
      qrcode.makeCode(url);
    }
  }

  onMount(async () => {
    const content = await clipboard.readText();
    url = v.parse(v.string(), content);
  });

  function getQRCodePngBase64(): Promise<string> {
    return new Promise((resolve, reject) => {
      const cvs = document.querySelector("canvas");
      if (cvs) {
        // extract png base64 from cvs
        const png = cvs.toDataURL("image/png");
        const base64 = png.replace(/^data:image\/(png|jpg);base64,/, "");
        resolve(base64);
      } else {
        reject("Canvas not found");
      }
    });
  }

  async function download() {
    const cvs = document.querySelector("canvas");
    if (cvs) {
      cvs.toBlob(async (blob) => {
        if (!blob) {
          return;
        }
        const filePath = await dialog.save({
          filters: [
            {
              name: "Image",
              extensions: ["png"],
            },
          ],
        });
        if (!filePath) {
          return;
        }
        blob.arrayBuffer().then((buffer) => {
          const uint8Array = new Uint8Array(buffer);
          fs.writeBinaryFile(filePath, uint8Array);
        });
      });
    }
  }

  async function saveToClipboard() {
    const b64 = await getQRCodePngBase64();
    clipboard.writeImageBase64(b64);
  }
</script>

<div class="flex flex-col justify-center items-center h-screen space-y-5">
  <Input bind:value={url} type="text" placeholder="URL" class="max-w-xl" />
  <div class="flex w-96 space-x-2 justify-center">
    <Button on:click={download}>
      <DownloadIcon class="mr-1" />
      Download
    </Button>
    <Button on:click={saveToClipboard}>
      <ClipboardCopyIcon class="mr-1" />
      Save To Clipboard</Button
    >
    <a href="./read-qrcode">
      <Button>Read QRCode</Button>
    </a>
  </div>
  <div class="w-60">
    <QR bind:url bind:qrcode />
  </div>
  {#if url}
    <div class="prose mt-3">
      <pre>{url}</pre>
    </div>
  {/if}
</div>
