import { loadExtensionManifestFromDisk } from "@/lib/commands/extensions"
import { db, decompressTarball } from "@kksh/api/commands"
import type { ExtPackageJsonExtra } from "@kksh/api/models"
import { basename, extname, join as pathJoin, tempDir } from "@tauri-apps/api/path"
import * as dialog from "@tauri-apps/plugin-dialog"
import * as fs from "@tauri-apps/plugin-fs"
import { download } from "@tauri-apps/plugin-upload"
import { useExtensionStore } from "~/stores/extension"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import { z, ZodError } from "zod"

/**
 *
 * @param tarballPath path to .tar.gz file
 */
export async function installTarball(tarballPath: string, targetDir: string) {
	const tempDirPath = await tempDir()
	if (!targetDir) {
		return Promise.reject("Extension Folder Not Set")
	}
	// decompress tarball to tempDir
	const decompressDest = await decompressTarball(
		tarballPath,
		await pathJoin(tempDirPath, uuidv4()),
		{
			overwrite: true
		}
	)
	return loadExtensionManifestFromDisk(await pathJoin(decompressDest, "package.json"))
		.then(async (manifest) => {
			// The extension folder name will be the identifier
			const extInstallPath = await pathJoin(targetDir, manifest.kunkun.identifier)
			if (await fs.exists(extInstallPath)) {
				const overwrite = await dialog.ask(
					`Extension ${manifest.kunkun.identifier} already exists, do you want to overwrite it?`
				)
				if (!overwrite) {
					return Promise.reject("Extension Already Exists")
				}
				await fs.remove(extInstallPath, { recursive: true })
			}
			await fs.rename(decompressDest, extInstallPath)
			await db.createExtension({
				identifier: manifest.kunkun.identifier,
				version: manifest.version,
				enabled: true,
				path: extInstallPath,
				data: undefined
			})
			console.log("installTarball in DB success", manifest)
		})
		.catch((err) => {
			if (err instanceof ZodError) {
				console.error(err)
				throw new Error("Invalid Manifest or Extension")
			}
			console.log()

			throw new Error(err)
		})
}

/**
 * Install extension tarball from a URL
 * @param tarballUrl URL to the tarball
 * @param targetDir Target directory to install the tarball
 * @returns
 */
export async function installTarballUrl(tarballUrl: string, targetDir: string): Promise<void> {
	const filename = await basename(tarballUrl)
	if (filename) {
		const tempDirPath = await tempDir()
		let tarballPath = await pathJoin(tempDirPath, filename)
		await download(tarballUrl, tarballPath)
		await installTarball(tarballPath, targetDir)
		await fs.remove(tarballPath)
		// } catch (error: any) {
		//   const { toast } = useToast();
		//   // toast({ title: error, variant: "destructive" });
		// }
	} else {
		return Promise.reject("Invalid Tarball URL. Cannot parse filename")
	}
}

export async function installDevExtensionDir(dirPath: string): Promise<ExtPackageJsonExtra> {
	const manifestPath = await pathJoin(dirPath, "package.json")
	if (!(await fs.exists(manifestPath))) {
		return Promise.reject(
			`Invalid Extension Folder. Manifest package.json doesn't exist at ${manifestPath}`
		)
	}
	return loadExtensionManifestFromDisk(manifestPath)
		.then(async (manifest) => {
			const exts = await db.getAllExtensionsByIdentifier(manifest.kunkun.identifier)
			const extExists = exts.find((ext) => ext.path === dirPath)
			if (extExists) {
				return Promise.reject(`Extension Already Exists at ${extExists.path}. It will be skipped.`)
			}
			// manifest.extPath
			return db
				.createExtension({
					identifier: manifest.kunkun.identifier,
					version: manifest.version,
					enabled: true,
					path: dirPath,
					data: undefined
				})
				.then(() => {
					return manifest
				})
				.catch((err) => {
					return Promise.reject(err)
				})
		})
		.catch((err) => {
			return Promise.reject(err)
		})
}

export async function installThroughNpmAPI(url: string, targetDir: string) {
	return axios.get(url).then((res) => {
		const tarball = z.string().parse(res.data?.dist?.tarball)
		console.log(tarball)
		if (tarball) {
			return installTarballUrl(tarball, targetDir)
		} else {
			ElMessage.error("Tarball Not Found")
		}
	})
}

export async function installFromNpmPackageName(name: string, targetDir: string) {
	return installThroughNpmAPI(`https://registry.npmjs.org/${name}/latest`, targetDir)
}
