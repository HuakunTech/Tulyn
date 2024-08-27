import { loadExtensionManifestFromDisk } from "@/lib/commands/extensions"
import { decompressTarball, getDevExtensionFolder, getExtensionFolder } from "@kksh/api/commands"
import { desktopDir, downloadDir, join as pathJoin, tempDir } from "@tauri-apps/api/path"
import * as dialog from "@tauri-apps/plugin-dialog"
import * as fs from "@tauri-apps/plugin-fs"
import { download } from "@tauri-apps/plugin-upload"
import { v4 as uuidv4 } from "uuid"
import { ZodError } from "zod"

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

export async function installTarballUrl(tarballUrl: string, targetDir: string): Promise<void> {
	const filename = tarballUrl.split("/").pop()
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
