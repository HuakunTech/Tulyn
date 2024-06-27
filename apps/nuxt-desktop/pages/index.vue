<script setup lang="ts">
import clipboard from 'tauri-plugin-clipboard-api';

onMounted(() => {
    clipboard.readText().then(console.log)
})
</script>
<template>
    <h1>Hello World</h1>

</template>