<script setup lang="ts">
import CommandInput from "@/components/cmd-palette/CommandInput.vue"
import ExtListItem from "@/components/extension-store/ext-list-item.vue"
import ExtDrawer from "@/components/extension-store/ExtDrawer.vue"
// import Command from "@/components/extension-store/Command.vue";
import { ExtItem, ExtItemParser } from "@/components/extension-store/types"
import { getExtensionsFolder, SUPABASE_ANON_KEY, SUPABASE_GRAPHQL_ENDPOINT } from "@/lib/constants"
// import { Extension } from "@/lib/extension/ext"
import { gqlClient } from "@/lib/utils/graphql"
import * as supabase from "@/lib/utils/supabase"
import { ApolloClient, gql, HttpLink, InMemoryCache, type ApolloQueryResult } from "@apollo/client"
import { isCompatible } from "@kksh/api"
import type { ExtPackageJsonExtra } from "@kksh/api/models"
import {
	AllExtensionsDocument,
	FindLatestExtDocument,
	type AllExtensionsQuery,
	type FindLatestExtQuery,
	type FindLatestExtQueryVariables
} from "@kksh/gql"
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

const localePath = useLocalePath()
const selectedExt = ref<ExtItem>()
const extDrawerOpen = ref(false)
const extList = ref<ExtItem[]>([])
const installedManifests = ref<ExtPackageJsonExtra[]>([])
const extStore = useExtensionStore()
// const extStore = useExtStore()
const searchTerm = ref("")
const storeExtPath = await getExtensionsFolder()

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
	const response: ApolloQueryResult<AllExtensionsQuery> = await gqlClient.query({
		query: AllExtensionsDocument
	})

	extList.value =
		response.data.extensionsCollection?.edges
			.map((x) => {
				const parsedNode = safeParse(ExtItemParser, x.node)
				if (!parsedNode.success) {
					console.error(`Fail to parse extension`, x.node)
					console.error(flatten(parsedNode.issues))
				}
				return parsedNode.success ? parse(ExtItem, parsedNode.output) : null
			})
			.filter((x) => x !== null) ?? []
})

const sortedExtList = computed(() => {
	return extList.value.sort((a, b) => (isUpgradeable(b) ? 1 : isUpgradeable(a) ? -1 : 0))
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
		{} as Record<string, ExtItem>
	)
})

function select(item: ExtItem) {
	navigateTo(`/store/${item.identifier}`)
	selectedExt.value = item
	extDrawerOpen.value = true
}

// function isInstalled(identifier: string) {
// 	return !!installedManifests.value.find((x) => x.kunkun.identifier === identifier)
// }

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
		extStore.uninstallExt(extPublish.identifier).then((manifest) => {
			ElMessage.success(`Uninstalled: ${manifest.name}`)
			extDrawerOpen.value = false
			refreshListing()
		})
	} else {
		ElMessage.error("No Extension Selected")
	}
}

const filterFunc = (items: ExtItem[], searchTerm: string) => {
	return items.filter((item) => {
		return (
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.short_description.toLowerCase().includes(searchTerm.toLowerCase())
		)
	})
}

function isUpgradeable(item: ExtItem) {
	if (!item.version) return true // latest extensions always have version, this check should be removed later
	const installed = installedExtMap.value[item.identifier]
	if (!installed) return false
	return (
		gt(item.version, installed.version) &&
		(item.api_version ? isCompatible(item.api_version) : true)
	)
}

function upgrade(item: ExtItem) {
	extStore
		.uninstallExt(item.identifier)
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
			:filterFunction="(val, searchTerm) => filterFunc(val as ExtItem[], searchTerm)"
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
