import { confirm } from "@tauri-apps/plugin-dialog"
import { relaunch } from "@tauri-apps/plugin-process"
import { check } from "@tauri-apps/plugin-updater"
import { ElMessage, ElNotification } from "element-plus"
import { gqlClient } from "@/lib/utils/graphql"
import { FindLatestExtDocument, type FindLatestExtQuery, type FindLatestExtQueryVariables } from "@kksh/gql"
import {gt} from 'semver'
import type { ExtPackageJsonExtra } from "@kksh/api/models"


export async function checkUpdateAndInstall() {
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

export async function checkSingleExtensionUpdate(installedExt: ExtPackageJsonExtra) {
const extStore = useExtStore()
const response = await gqlClient.query<FindLatestExtQuery, FindLatestExtQueryVariables>({
		query: FindLatestExtDocument,
		variables: {
			identifier: installedExt.kunkun.identifier
		}
	})
	const exts = response.data.ext_publishCollection?.edges
	console.log(exts);
	if (!exts || exts?.length <= 0) {
		return
	}
	const ext = exts[0].node
	if (gt(ext.version, installedExt.version)) {
		console.log(`new version available ${installedExt.kunkun.identifier} ${ext.version}`);
		ElNotification.info(`Extension ${installedExt.kunkun.identifier} has a new version ${ext.version}, you can upgrade in Store.`)
	}
}

export async function checkExtensionUpdate() {
	console.log("checkExtensionUpdate");
	
	const extStore = useExtStore()
	extStore.manifests.forEach(async (ext) => {
			await checkSingleExtensionUpdate(ext)
	})
}