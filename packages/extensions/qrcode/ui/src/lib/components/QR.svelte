<script lang="ts">
  import QRCode from "easyqrcodejs";

  export let url: string;
  let node: HTMLDivElement;
  export let qrcode: QRCode | undefined;

  $: {
    if (url) {
      if (!qrcode) {
        qrcode = new QRCode(node, {
          text: url,
          width: 200,
          height: 200,
          quietZone: 10,
        });
      }
    }
  }
</script>

<div class={$$props.class} bind:this={node}></div>

<style scoped>
  div {
    /* make QR-wrapper squared */
    width: 100%;
    position: relative;
    padding: 50%;
    z-index: 1;
  }
  div :global(canvas) {
    /* fit QR to wrapper */
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
