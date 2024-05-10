<script lang="ts">
  import jsQR from "jsqr";
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";

  let imgSrc = "";
  let detectedCode = "";

  async function readScreenshot() {
    const clipboardContents = await navigator.clipboard.read();
    for (const item of clipboardContents) {
      if (!item.types.includes("image/png")) {
        // throw new Error("Clipboard does not contain PNG image data.");
        continue;
      }
      const blob = await item.getType("image/png");
      imgSrc = URL.createObjectURL(blob);
      // turn blob to Uint8ClampedArray
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        if (!imageData) {
          throw new Error("Failed to get image data.");
        }
        const code = jsQR(imageData?.data, imageData?.width, imageData?.height);
        if (code) {
          console.log(code.data);
          detectedCode = code.data;
        } else {
          console.log("No QR code found.");
        }
        canvas.remove();
        img.remove();
      };
    }
  }

  onMount(async () => {
    readScreenshot();
  });
</script>

<div class="flex flex-col justify-center items-center h-screen space-y-5">
  <h1 class="text-3xl">Read QRCode From Clipboard Screenshot</h1>
  <Button on:click={readScreenshot}>Read Screenshot From Clipboard</Button>
  <img width="400" src={imgSrc} alt="" />
  <a href={detectedCode}>{detectedCode}</a>
</div>
