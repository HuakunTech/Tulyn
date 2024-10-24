import { getExtensionsFolder } from "~/lib/constants"
import { useAppsLoaderStore } from "~/stores/appLoader"
import { useBuiltInCmdStore } from "~/stores/builtinCmdLoader"
import { useExtensionStore } from "~/stores/extension"
import { useDevExtStore, useExtStore } from "~/stores/extensionLoader"
import { useQuicklinkLoader } from "~/stores/quickLink"
import { useRemoteCmdStore } from "~/stores/remoteCmds"
import { useSystemCmdsStore } from "~/stores/systemCmds"

export async function initStores() {
	// Init Stores
	const appConfig = useAppConfigStore()
	const appsLoaderStore = useAppsLoaderStore()
	appsLoaderStore.load()
	const sysCmdsStore = useSystemCmdsStore()
	sysCmdsStore.load()
	const remoteCmdStore = useRemoteCmdStore()
	remoteCmdStore.load()
	const builtinCmdStore = useBuiltInCmdStore()
	builtinCmdStore.load()
	const extStore = useExtensionStore()
	extStore.load()
	// const devExtStore = useDevExtStore()
	// devExtStore.setExtPath(appConfig.devExtensionPath ?? undefined)
	// devExtStore.load()
	// const extStore = useExtStore()
	// extStore.setExtPath(await getExtensionsFolder())
	// extStore.load()
	const quicklinkLoader = useQuicklinkLoader()
	quicklinkLoader.load()
}
