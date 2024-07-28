<script setup lang="ts">
import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { $themeConfig, ThemeConfig, updateTheme } from "@/stores/config"
import { useStore } from "@nanostores/vue"
import { onMounted, reactive, watch } from "vue"
import ThemeCustomizer from "./components/theme/ThemeCustomizer.vue"

const themeConfigStore = useStore($themeConfig)
const themeConfig = reactive<ThemeConfig>({
	theme: "neutral",
	radius: 0.5,
	lightMode: "auto"
})
onMounted(() => {
	themeConfig.lightMode = themeConfigStore.value.lightMode
	themeConfig.theme = themeConfigStore.value.theme
	themeConfig.radius = themeConfigStore.value.radius
})

watch(themeConfig, (newThemeConfig) => {
	updateTheme(newThemeConfig)
})
</script>

<template>
	<Button>Hello</Button>
	<Alert>Alert</Alert>
	<pre>{{ themeConfig }}</pre>
	<ThemeCustomizer
		v-model:lightMode="themeConfig.lightMode"
		v-model:theme="themeConfig.theme"
		v-model:radius="themeConfig.radius"
	/>
</template>
