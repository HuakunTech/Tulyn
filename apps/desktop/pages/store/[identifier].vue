<script setup lang="ts">
import DialogImage from "@/components/extension-store/DialogImage.vue"
import { gqlClient } from "@/lib/utils/graphql"
import * as supabase from "@/lib/utils/supabase"
import { supabaseClient } from "@/lib/utils/supabase"
import { installTarballUrl } from "@/lib/utils/tarball"
import { getDevExtensionFolder, getExtensionFolder } from "@kksh/api/commands"
import { IconEnum, KunkunExtManifest } from "@kksh/api/models"
import { AllKunkunPermission, FsPermissionMap, permissionDescriptions } from "@kksh/api/permissions"
import {
	FindLatestExtDocument,
	type FindLatestExtQuery,
	type FindLatestExtQueryVariables
} from "@kksh/gql"
import { type Tables } from "@kksh/supabase"
import { Button } from "@kksh/vue/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kksh/vue/hover-card"
import { ScrollArea } from "@kksh/vue/scroll-area"
import { Separator } from "@kksh/vue/separator"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { error } from "@tauri-apps/plugin-log"
import { onKeyStroke } from "@vueuse/core"
import { ElMessage } from "element-plus"
import { CircleCheckBigIcon, Trash2Icon } from "lucide-vue-next"
import * as v from "valibot"
import { z } from "zod"

const route = useRoute()
const extIdentifier = route.params.identifier as string
const imageDialogOpen = ref(false)
const currentExt = ref<Tables<"ext_publish"> | null>(null)
const manifest = ref<KunkunExtManifest | null>(null)
const extStore = useExtStore()

onKeyStroke("Escape", (e) => {
	e.preventDefault()
	navigateTo("/extension-store")
})

function onBack() {
	navigateTo("/extension-store")
}

onMounted(async () => {
	const response = await gqlClient.query<FindLatestExtQuery, FindLatestExtQueryVariables>({
		query: FindLatestExtDocument,
		variables: {
			identifier: extIdentifier
		}
	})
	const exts = response.data.ext_publishCollection?.edges
	if (exts && exts.length > 0) {
		// @ts-ignore
		currentExt.value = exts[0].node
		manifest.value = v.parse(
			KunkunExtManifest,
			// @ts-ignore
			JSON.parse(currentExt.value?.manifest as string)
		)
	} else {
		currentExt.value = null
	}
})
const stringPermissions = computed(() =>
	manifest.value?.permissions.map((p) => (typeof p === "string" ? p : p.permission))
)
const isInstalled = computed(() => {
	return extStore.manifests.find((m) => m.kunkun.identifier === extIdentifier) !== undefined
})
// TODO implement install and uninstall
const demoImages = computed(() => {
	return currentExt.value?.demo_images.map((src) => supabase.getFileUrl(src).data.publicUrl) ?? []
})

async function installExt() {
	if (!currentExt.value) {
		return ElMessage.error("Unexpected Error: No Extension Selected")
	}
	const tarballUrl = supabase.getFileUrl(currentExt.value.tarball_path).data.publicUrl
	console.log(`Install tarball: ${tarballUrl}`)

	getExtensionFolder()
		.then((targetInstallDir) => {
			console.log("targetInstallDir", targetInstallDir)

			if (!targetInstallDir) {
				return Promise.reject("Unexpected Error: Extension Folder is Null")
			} else {
				return installTarballUrl(tarballUrl, targetInstallDir)
			}
		})
		.then(async () => {
			ElMessage.success(`Plugin ${currentExt.value!.name} Installed`)
			extStore.load() // used to refresh isInstalled
			if (currentExt.value) {
				const { data, error } = await supabaseClient.functions.invoke("increment-downloads", {
					body: { identifier: currentExt.value.identifier, version: currentExt.value.version }
				})
				const { downloads } = z.object({ downloads: z.number() }).parse(data)
				// emits("update:open", false)
				// emits("installed", downloads)
			}
		})
		.catch((err) => {
			ElMessage.error("Fail to install tarball")
			ElMessage.error(err)
		})
}

async function uninstallExt() {
	if (!currentExt.value) {
		return ElMessage.error("Unexpected Error: No Extension Selected")
	}
	extStore
		.uninstallExt(extIdentifier)
		.then((manifest) => {
			ElMessage.success(`Uninstalled: ${manifest.name}`)
			extStore.load() // used to refresh isInstalled
		})
		.catch((err) => {
			ElMessage.error("Fail to uninstall extension")
			error(`Failed to uninstall extension ${extIdentifier}: ${err}`)
		})
}
</script>
<template>
	<Button variant="outline" size="icon" class="absolute left-4 top-4 z-50" @click="onBack">
		<ArrowLeftIcon />
	</Button>
	<div data-tauri-drag-region class="h-14"></div>
	<main class="px-10">
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
			<li v-for="perm in stringPermissions" class="flex h-8 items-center gap-2">
				<span class="font-mono text-sm">{{ perm }}</span>
				<HoverCard>
					<HoverCardTrigger class="flex items-center">
						<IconMultiplexer
							class="border"
							:icon="{ type: IconEnum.Iconify, value: 'material-symbols:info-outline' }"
						/>
					</HoverCardTrigger>
					<HoverCardContent class="w-96 max-h-96 overflow-y-auto">
						<ScrollArea>
							<span class="text-sm">{{ permissionDescriptions[perm] }}</span>
							<pre class="text-xs">{{
								manifest?.permissions.find((p) => p.permission === perm || p === perm)
							}}</pre>
						</ScrollArea>
					</HoverCardContent>
				</HoverCard>
			</li>
			<Separator class="my-3" />
			<h2 class="text-lg font-bold">Description</h2>
			<span class="text-sm">
				{{ manifest?.shortDescription }}
			</span>
			<span class="text-sm">
				{{ manifest?.longDescription }}
			</span>
			<Separator class="my-3" />
			<h2 class="text-lg font-bold">Commands</h2>
			<ul>
				<li v-if="manifest" v-for="cmd in [...manifest.customUiCmds, ...manifest.templateUiCmds]">
					<div class="flex items-center space-x-3">
						<IconMultiplexer v-if="manifest" :icon="manifest?.icon" class="inline h-6 w-6" />
						<div>
							<span class="text-dm">{{ cmd.name }}</span>
							<h2 class="text-xs">{{ cmd.description }}</h2>
						</div>
					</div>
					<Separator class="my-3" />
				</li>
			</ul>
		</ScrollArea>
	</main>
	<Button
		class="absolute bottom-0 w-full rounded-none bg-green-600 hover:bg-green-500"
		v-if="!isInstalled"
		@click="installExt"
	>
		Install <Icon name="mi:enter" class="ml-2 h-5 w-5" />
	</Button>
	<Button
		class="absolute bottom-0 w-full rounded-none bg-red-600 hover:bg-red-500"
		v-else
		variant="destructive"
		@click="uninstallExt"
	>
		Uninstall
		<Trash2Icon class="ml-2 h-5 w-5" />
	</Button>
</template>
