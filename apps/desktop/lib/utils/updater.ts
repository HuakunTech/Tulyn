import { gqlClient } from "@/lib/utils/graphql"
import * as supabase from "@/lib/utils/supabase"
import { isCompatible } from "@kksh/api"
import { getExtensionFolder } from "@kksh/api/commands"
import type { ExtPackageJsonExtra } from "@kksh/api/models"
import {
	FindLatestExtDocument,
	type FindLatestExtQuery,
	type FindLatestExtQueryVariables
} from "@kksh/gql"
import { confirm } from "@tauri-apps/plugin-dialog"
import { relaunch } from "@tauri-apps/plugin-process"
import { check } from "@tauri-apps/plugin-updater"
import { ElMessage, ElNotification } from "element-plus"
import { gt } from "semver"
import { installTarballUrl } from "./tarball"
import { error } from "@tauri-apps/plugin-log"

export async function checkUpdateAndInstall() {
	const update = await check()
	console.log("update", update)
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

export function installExtension(identifier: string) {
	return getExtensionFolder().then(async (targetInstallDir) => {
		if (!targetInstallDir) {
			return Promise.reject("Unexpected Error: Extension Folder is Null")
		} else {
			const response = await gqlClient.query<FindLatestExtQuery, FindLatestExtQueryVariables>({
				query: FindLatestExtDocument,
				variables: {
					identifier
				}
			})
			const exts = response.data.ext_publishCollection?.edges
			if (exts && exts.length > 0) {
				const tarballUrl = supabase.getFileUrl(exts[0].node.tarball_path).data.publicUrl
				return installTarballUrl(tarballUrl, targetInstallDir)
			} else {
				return Promise.reject("Couldn't find the extension to install from the server")
			}
		}
	})
}

export async function checkSingleExtensionUpdate(
	installedExt: ExtPackageJsonExtra,
	autoupgrade: boolean
) {
	const response = await gqlClient.query<FindLatestExtQuery, FindLatestExtQueryVariables>({
		query: FindLatestExtDocument,
		variables: {
			identifier: installedExt.kunkun.identifier
		}
	})
	const exts = response.data.ext_publishCollection?.edges
	if (!exts || exts?.length <= 0) {
		return
	}
	const ext = exts[0].node
	if (
		gt(ext.version, installedExt.version) &&
		(ext.api_version ? isCompatible(ext.api_version) : true)
	) {
		if (autoupgrade) {
			const extStore = useExtStore()
			await extStore
				.uninstallExt(installedExt.kunkun.identifier)
				.then(() => installExtension(ext.identifier))
				.catch((err) => {
					ElMessage.error(`${err}`)
					error(`Failed to upgrade extension ${installedExt.kunkun.identifier}: ${err}`)
				})
			return true
		} else {
			console.log(`new version available ${installedExt.kunkun.identifier} ${ext.version}`)
			ElNotification.info({
				message: `Extension ${installedExt.kunkun.identifier} has a new version ${ext.version}, you can upgrade in Store.`,
				duration: 10_000
			})
		}
	}
	return false
}

export async function checkExtensionUpdate(autoupgrade: boolean = false) {
	console.log("autoupgrade", autoupgrade)

	const extStore = useExtStore()
	let upgradedCount = 0
	for (const ext of extStore.manifests) {
		const upgraded = await checkSingleExtensionUpdate(ext, autoupgrade)
		if (upgraded) {
			upgradedCount++
		}
	}
	console.log("upgradedCount", upgradedCount)

	if (upgradedCount > 0) {
		ElNotification.info(`${upgradedCount} extensions have been upgraded`)
	}
}
