<script setup lang="ts">
import DialogImage from "@/components/extension-store/DialogImage.vue"
import PermissionInspector from "@/components/extension-store/permission-inspector.vue"
import PlatformsIcons from "@/components/extension-store/platforms-icons.vue"
import * as supabase from "@/lib/utils/supabase"
import { IconEnum, KunkunExtManifest } from "@kksh/api/models"
import { type Tables } from "@kksh/supabase"
import { Button } from "@kksh/vue/button"
import { ScrollArea } from "@kksh/vue/scroll-area"
import { Separator } from "@kksh/vue/separator"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { error } from "@tauri-apps/plugin-log"
import { onKeyStroke } from "@vueuse/core"
import { getExtensionsFolder } from "~/lib/constants"
import { installTarballUrl } from "~/lib/utils/install"
import { isExtPathInDev } from "~/lib/utils/path"
import { useExtensionStore } from "~/stores/extension"
import { ElMessage } from "element-plus"
import { CircleCheckBigIcon, Trash2Icon } from "lucide-vue-next"
import * as v from "valibot"
import { z } from "zod"

const route = useRoute()
const storeExtPath = await getExtensionsFolder()
const extIdentifier = route.params.identifier as string
const imageDialogOpen = ref(false)
const installLoading = ref(false)
const uninstallLoading = ref(false)
const currentExt = ref<Tables<"ext_publish"> | null>(null)
const manifest = ref<KunkunExtManifest | null>(null)
const extStore = useExtensionStore()
const sb = useSupabaseClient()

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	onBack()
})

onKeyStroke("Enter", (e) => {
	e.preventDefault()
	installExt()
})

function onBack() {
	navigateTo("/extension-store")
}

onMounted(async () => {
	const { data } = await sb
		.from("ext_publish")
		.select(
			"created_at, name, version, manifest, shasum, size, tarball_path, cmd_count, identifier, downloads, demo_images, api_version"
		)
		.order("created_at", { ascending: false })
		.eq("identifier", extIdentifier)
		.select()
		.limit(1)
		.single()
	console.log(extIdentifier, data)
	if (data) {
		currentExt.value = data
		manifest.value = v.parse(KunkunExtManifest, data.manifest)
	}
})

const isInstalled = computedAsync(async () => {
	return (
		extStore.manifests.find(
			(m) => m.kunkun.identifier === extIdentifier && !isExtPathInDev(storeExtPath, m.extPath)
		) !== undefined
	)
})

const demoImages = computed(() => {
	return currentExt.value?.demo_images.map((src) => supabase.getFileUrl(src).data.publicUrl) ?? []
})

async function installExt() {
	installLoading.value = true
	if (!currentExt.value) {
		return ElMessage.error("Unexpected Error: No Extension Selected")
	}
	const tarballUrl = supabase.getFileUrl(currentExt.value.tarball_path).data.publicUrl
	console.log(`Install tarball: ${tarballUrl}`)
	installTarballUrl(tarballUrl, storeExtPath)
		.then(async () => {
			ElMessage.success(`Plugin ${currentExt.value!.name} Installed`)
			extStore.load() // used to refresh isInstalled
			if (currentExt.value) {
				const { data, error } = await sb.functions.invoke("increment-downloads", {
					body: { identifier: currentExt.value.identifier, version: currentExt.value.version }
				})
				const { downloads } = z.object({ downloads: z.number() }).parse(data)
			}
		})
		.catch((err) => {
			ElMessage.error("Fail to install tarball")
			ElMessage.error(err)
		})
		.finally(() => {
			installLoading.value = false
		})
}

async function uninstallExt() {
	uninstallLoading.value = true
	if (!currentExt.value) {
		return ElMessage.error("Unexpected Error: No Extension Selected")
	}
	extStore
		.uninstallStoreExtByIdentifier(extIdentifier)
		.then((manifest) => {
			ElMessage.success(`Uninstalled: ${manifest.name}`)
			extStore.load() // used to refresh isInstalled
		})
		.catch((err) => {
			ElMessage.error("Fail to uninstall extension")
			error(`Failed to uninstall extension ${extIdentifier}: ${err}`)
		})
		.finally(() => {
			uninstallLoading.value = false
		})
}
</script>
<template>
	<div class="h-screen">
		<Button variant="outline" size="icon" class="fixed left-2 top-2 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<div v-if="currentExt" h-full>
			<main class="px-10 pb-10">
				<div data-tauri-drag-region class="h-14"></div>
				<div class="flex items-center gap-4">
					<IconMultiplexer v-if="manifest" :icon="manifest?.icon" class="h-12 w-12" />
					<div>
						<span class="flex items-center">
							<strong class="text-xl">{{ manifest?.name }}</strong>
							<CircleCheckBigIcon v-if="isInstalled" class="ml-2 inline text-green-400" />
						</span>
						<pre class="text-muted-foreground text-xs">{{ currentExt?.identifier }}</pre>
						<pre class="text-muted-foreground text-xs">Version: {{ currentExt?.version }}</pre>
					</div>
				</div>
				<ScrollArea class="">
					<div
						v-if="demoImages.length > 0"
						class="mx:auto flex w-full snap-x snap-mandatory space-x-4 overflow-x-scroll"
					>
						<DialogImage v-model:open="imageDialogOpen" :img-src="demoImages" />
						<img
							v-for="src in demoImages"
							:src="src"
							class="inline h-32 cursor-pointer"
							@click="imageDialogOpen = true"
							alt=""
						/>
					</div>
					<Separator class="my-3" />

					<h2 class="text-lg font-bold">Security and Privacy</h2>
					<PermissionInspector v-if="manifest" :manifest="manifest" />
					<Separator class="my-3" />
					<h2 class="text-lg font-bold">Description</h2>
					<div class="text-sm">
						{{ manifest?.shortDescription }}
					</div>
					<div class="text-sm">
						{{ manifest?.longDescription }}
					</div>
					<Separator class="my-3" />
					<h2 class="text-lg font-bold">Commands</h2>
					<ul>
						<li
							v-if="manifest"
							v-for="cmd in [...manifest.customUiCmds, ...manifest.templateUiCmds]"
						>
							<div class="flex items-center space-x-3">
								<IconMultiplexer v-if="manifest" :icon="manifest?.icon" class="inline h-6 w-6" />
								<div>
									<span class="text-dm">{{ cmd.name }}</span>
									<h2 class="text-xs">{{ cmd.description }}</h2>
								</div>
								<PlatformsIcons :platforms="cmd.platforms" />
							</div>
							<Separator class="my-3" />
						</li>
					</ul>
				</ScrollArea>
			</main>

			<Button
				class="fixed bottom-0 flex w-full space-x-2 rounded-none bg-green-700 text-white hover:bg-green-600"
				v-if="!isInstalled"
				:disabled="installLoading"
				@click="installExt"
			>
				<span>Install</span>
				<IconMultiplexer
					v-if="installLoading"
					:icon="{ type: IconEnum.Iconify, value: 'uil:spinner-alt' }"
					class="h-6 w-6 animate-spin"
				/>
				<Icon v-else name="mi:enter" class="h-5 w-5" />
			</Button>
			<Button
				class="fixed bottom-0 w-full space-x-2 rounded-none bg-red-600 hover:bg-red-500"
				v-else
				:disabled="uninstallLoading"
				variant="destructive"
				@click="uninstallExt"
			>
				<span>Uninstall</span>
				<IconMultiplexer
					v-if="uninstallLoading"
					:icon="{ type: IconEnum.Iconify, value: 'uil:spinner-alt' }"
					class="h-6 w-6 animate-spin"
				/>
				<Trash2Icon v-else class="h-5 w-5" />
			</Button>
		</div>
		<div v-else class="flex h-full w-full items-center justify-center border-4">
			<IconMultiplexer
				:icon="{ type: IconEnum.Iconify, value: 'uil:spinner-alt' }"
				class="h-6 w-6 animate-spin"
			/>
		</div>
	</div>
</template>
