<script lang="ts">
  import jsQR from "jsqr";
  import { clipboard } from "@jarvis/api-ui";
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";

  let imgSrc = "";
  let detectedCode = "";

  async function readScreenshot() {
    try {
      const blobImg: Blob = (await clipboard.readImageBinary("Blob")) as Blob;
      imgSrc = URL.createObjectURL(blobImg);
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
          detectedCode = code.data;
        } else {
          console.warn("No QR code found.");
        }
        canvas.remove();
        img.remove();
      };
    } catch (error) {
      console.error(error);
    }
  }

  onMount(async () => {
    readScreenshot();
  });
</script>

<div class="flex flex-col justify-center items-center h-screen space-y-5">
  <div class="flex space-x-3">
    <Button on:click={readScreenshot}
      >Read QRCode Screenshot From Clipboard</Button
    >
    <a href="./">
      <Button>Generate QRCode</Button>
    </a>
  </div>
  <img width="400" src={imgSrc} alt="" />
  <a href={detectedCode}>{detectedCode}</a>
</div>
