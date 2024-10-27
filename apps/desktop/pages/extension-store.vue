<script setup lang="ts">
import CommandInput from "@/components/cmd-palette/CommandInput.vue"
import ExtListItem from "@/components/extension-store/ext-list-item.vue"
import { getExtensionsFolder } from "@/lib/constants"
import { isCompatible } from "@kksh/api"
import type { ExtPackageJsonExtra } from "@kksh/api/models"
import { type Tables } from "@kksh/supabase"
import { Button } from "@kksh/vue/button"
import { ArrowLeftIcon } from "@radix-icons/vue"
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from "~/components/ui/command"
import { installTarballUrl } from "~/lib/utils/install"
import { isExtPathInDev } from "~/lib/utils/path"
import { installExtension } from "~/lib/utils/updater"
import { useExtensionStore } from "~/stores/extension"
import { useExtStore } from "~/stores/extensionLoader"
import { ElMessage } from "element-plus"
import { gt } from "semver"
import { flatten, parse, safeParse } from "valibot"
import { onMounted, ref } from "vue"

type DbExtItem = Tables<"extensions">

const localePath = useLocalePath()
const selectedExt = ref<DbExtItem>()
const extDrawerOpen = ref(false)
const extList = ref<DbExtItem[]>([])
// const extList = ref<ExtItem[]>([])
const installedManifests = ref<ExtPackageJsonExtra[]>([])
const extStore = useExtensionStore()
const searchTerm = ref("")
const storeExtPath = await getExtensionsFolder()
const sb = useSupabaseClient()

function refreshListing() {
	return extStore.load().then(() => {
		installedManifests.value = extStore.manifests
	})
}

/**
 * Map extension identifier to the extension item
 */
const installedExtMap = computed(() => {
	return installedManifests.value.reduce(
		(acc, curr) => {
			acc[curr.kunkun.identifier] = curr
			return acc
		},
		{} as Record<string, ExtPackageJsonExtra>
	)
})

onKeyStroke("Escape", () => {
	if (document.activeElement?.nodeName === "INPUT") {
		navigateTo(localePath("/"))
	}
})

onMounted(async () => {
	refreshListing()
	const { data } = await sb
		.from("extensions")
		.select(
			"identifier, version, api_version, name, downloads, short_description, long_description, icon"
		)
		.order("downloads", { ascending: false })
		.select()
	extList.value = data ?? []
})
const sortedExtList = computed<DbExtItem[]>(() => {
	return extList.value.sort((a, b) => {
		// @ts-ignore
		return isUpgradeable(b) ? 1 : isUpgradeable(a) ? -1 : 0
	})
})

/**
 * Map extension identifier to the extension item
 */
const extListMap = computed(() => {
	return extList.value.reduce(
		(acc, curr) => {
			acc[curr.identifier] = curr
			return acc
		},
		{} as Record<string, DbExtItem>
	)
})

function select(item: DbExtItem) {
	navigateTo(`/store/${item.identifier}`)
	selectedExt.value = item
	extDrawerOpen.value = true
}

function getInstalledVersion(identifier: string) {
	return installedManifests.value.find(
		(x) => x.kunkun.identifier === identifier && !isExtPathInDev(storeExtPath, x.extPath)
	)?.version
}

function onInstalled(downloads: number) {
	refreshListing()
	if (selectedExt.value) {
		selectedExt.value.downloads = downloads
	}
}

function uninstall(extPublish: Tables<"ext_publish"> | null) {
	if (extPublish) {
		extStore.uninstallStoreExtByIdentifier(extPublish.identifier).then((manifest) => {
			ElMessage.success(`Uninstalled: ${manifest.name}`)
			extDrawerOpen.value = false
			refreshListing()
		})
	} else {
		ElMessage.error("No Extension Selected")
	}
}

const filterFunc = (items: DbExtItem[], searchTerm: string) => {
	return items.filter((item) => {
		return (
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.short_description.toLowerCase().includes(searchTerm.toLowerCase())
		)
	})
}

function isUpgradeable(item: DbExtItem): boolean {
	if (!item.version) return true // latest extensions always have version, this check should be removed later
	const installed = installedExtMap.value[item.identifier]
	if (!installed) return false
	return (
		gt(item.version, installed.version) &&
		(item.api_version ? isCompatible(item.api_version) : true)
	)
}

function upgrade(item: DbExtItem) {
	extStore
		.uninstallStoreExtByIdentifier(item.identifier)
		.then(() => installExtension(item.identifier))
		.then(() => {
			ElMessage.success(`Upgraded: ${item.name}; Version: ${item.version}`)
			refreshListing()
		})
		.catch((err) => {
			ElMessage.error(`${err}`)
			// error(`Failed to uninstall extension ${extIdentifier}: ${err}`)
		})
}

function goBack() {
	navigateTo(localePath("/"))
}
</script>
<template>
	<div class="h-full grow">
		<Command
			:filterFunction="(val, searchTerm) => filterFunc(val as DbExtItem[], searchTerm)"
			v-model:searchTerm="searchTerm"
		>
			<CommandInput placeholder="Type to search..." class="text-md h-12" :searchTerm="searchTerm">
				<Button size="icon" variant="outline" @click="goBack">
					<ArrowLeftIcon class="h-5 w-5 shrink-0" />
				</Button>
			</CommandInput>
			<CommandList class="h-full">
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Extensions">
					<ExtListItem
						v-for="item in sortedExtList"
						:data="item"
						@upgrade="upgrade(item)"
						:upgradeable="isUpgradeable(item)"
						:installedVersion="getInstalledVersion(item.identifier)"
						:installed="!!getInstalledVersion(item.identifier)"
						@select="select(item)"
					/>
				</CommandGroup>
			</CommandList>
			<CmdPaletteFooter />
		</Command>
	</div>
</template>
