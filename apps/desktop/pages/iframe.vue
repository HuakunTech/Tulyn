<!-- <script setup lang="ts">
import { clipboard, system } from "@tulyn/api/ui/iframe"
import { isMain } from "tauri-api-adapter"

onMounted(() => {
  console.log(isMain())

  clipboard.readText().then((text) => {
    console.log("clipboard read from iframe: ", text)
  })
  // clipboard.writeText("huakun")
  system
    .toggleMute()
    .then(() => {
      console.log("open trash successfully")
    })
    .catch((err) => {
      console.error("fail to open trash", err)
    })
})
</script>-->
<template>
  <h1>iframe</h1>
</template>
