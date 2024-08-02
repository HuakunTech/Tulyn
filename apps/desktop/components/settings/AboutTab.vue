<script setup lang="ts">
import { default as TauriLink } from "@/components/tauri/link.vue"
import { cn } from "@/lib/utils"
import { Button } from "@kksh/vue/button"
import { Card, CardContent } from "@kksh/vue/card"
import { getVersion } from "@tauri-apps/api/app"
import { confirm } from "@tauri-apps/plugin-dialog"
import { relaunch } from "@tauri-apps/plugin-process"
import { check } from "@tauri-apps/plugin-updater"
import { ElMessage, ElNotification } from "element-plus"
import { onMounted, ref, type HTMLAttributes } from "vue"

const appVersion = ref("")
onMounted(() => {
	getVersion().then((version) => {
		appVersion.value = version
	})
})
const props = defineProps<{
	class?: HTMLAttributes["class"]
}>()

async function checkUpdate() {
	const update = await check()
	if (update?.available) {
		const confirmUpdate = await confirm(
			`A new version ${update.version} is available. Do you want to install and relaunch?`
		)
		if (confirmUpdate) {
			await update.downloadAndInstall()
			await relaunch()
		}
	} else {
		ElNotification.info("You are on the latest version")
	}
}
</script>
<template>
	<Card :class="cn('flex h-full items-center justify-center border-none', props.class)">
		<CardContent class="flex items-center space-x-5">
			<img src="/img/logo-w-bg.png" class="w-44" />
			<div class="flex flex-col space-y-1">
				<p class="text-3xl font-bold">Akun</p>
				<p class="text-xs">Version: {{ appVersion }}</p>
				<p>
					<strong class="font-bold">Author: </strong>
					<TauriLink href="https://github.com/HuakunShen">
						@HuakunShen
						<Icon name="mdi:github" class="inline -translate-y-0.5 text-white" />
					</TauriLink>
				</p>
				<TauriLink href="https://github.com/HuakunTech/kunkun">
					Source Code
					<Icon name="mdi:github" class="inline -translate-y-0.5 text-white" />
				</TauriLink>
				<TauriLink href="https://github.com/HuakunTech/kunkunExtensions">
					Extensions Source Code
					<Icon name="mdi:github" class="inline -translate-y-0.5 text-white" />
				</TauriLink>
				<Button @click="checkUpdate" size="xs" variant="secondary">Check Update</Button>
			</div>
		</CardContent>
	</Card>
</template>
<!-- <script defer data-domain="huakunshen.com" src="https://plausible.io/js/script.js"></script> -->
