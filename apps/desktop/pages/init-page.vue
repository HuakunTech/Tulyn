<script setup lang="ts">
import { getCurrent } from "@tauri-apps/api/window"

onMounted(() => {
	getCurrent().show()
	setTimeout(() => {
		navigateTo("/")
	}, 500)
})
</script>
<template>
	<FunDance />
</template>
