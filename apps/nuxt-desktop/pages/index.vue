<script setup lang="ts">
import clipboard from 'tauri-plugin-clipboard-api';

onMounted(() => {
    clipboard.readText().then(console.log)
})
const { x, y } = useMouse()
</script>
<template>
    <h1>Hello World</h1>
    <Button>Hello</Button>
    <ModeToggle />
    <div>pos: {{ x }}, {{ y }}</div>
</template>