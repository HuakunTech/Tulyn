<script setup lang="ts">
import { getCurrentWindow } from "@tauri-apps/api/window"

const localePath = useLocalePath()

onMounted(() => {
	getCurrentWindow().show()
	setTimeout(() => {
		navigateTo(localePath("/"))
	}, 500)
})
</script>
<template>
	<FunDance />
</template>
