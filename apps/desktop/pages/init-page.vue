<script setup lang="ts">
import { getCurrent } from "@tauri-apps/api/window"

const localePath = useLocalePath()

onMounted(() => {
	getCurrent().show()
	setTimeout(() => {
		navigateTo(localePath("/"))
	}, 500)
})
</script>
<template>
	<FunDance />
</template>
