<script setup lang="ts">
import { convertFileSrc } from "@tauri-apps/api/core";

const imgUrl = convertFileSrc("/Users/hacker/Downloads/jarvis-logo.png", "mac-icns");
console.log(imgUrl);

// fetch(imgUrl)
//   // fetch("mac-icns://localhost/Users/hacker/Downloads/jarvis-logo.png")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
</script>
<template>
  <h1 class="text-3xl">Dev</h1>
  <img :src="imgUrl" alt="" />
</template>
