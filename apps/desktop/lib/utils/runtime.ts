import { unzip } from "@kksh/api/commands"
import { appDataDir, join, tempDir } from "@tauri-apps/api/path"
import { exists, remove } from "@tauri-apps/plugin-fs"
import { debug, error, info } from "@tauri-apps/plugin-log"
import { arch, platform } from "@tauri-apps/plugin-os"
import { download } from "@tauri-apps/plugin-upload"
import { verifyUrlAlive } from "~/lib/utils/request"
import { Command, executeBashScript, type ChildProcess } from "tauri-plugin-shellx-api"

export async function getAppRuntimePath() {
	return await join(await appDataDir(), "runtime")
}

abstract class Runtime {
	abstract exePath(): Promise<string>

	abstract install(options?: { overwrite: boolean }): Promise<void>

	abstract installPath(): Promise<string>

	abstract exists(): Promise<boolean>

	abstract version(): Promise<string>
}

export class Bun extends Runtime {
	inferredBunDownloadFilenameStem() {
		let _platform: string = platform()
		if (_platform === "macos") {
			_platform = "darwin"
		}
		return `bun-${_platform}-${arch()}`
	}

	async installPath() {
		return join(await getAppRuntimePath(), this.inferredBunDownloadFilenameStem())
	}

	async exePath() {
		return join(await this.installPath(), "bun")
	}

	/**
	 * Install bun to the runtime directory of appDataDir
	 * @param options use overwrite to force overwrite existing bun
	 * @returns installed bun version
	 */
	async install(options: { overwrite: boolean } = { overwrite: false }) {
		const bunInstallPath = await this.installPath()
		const bunExePath = await this.exePath()
		if (await exists(bunExePath)) {
			if (options.overwrite) {
				await remove(bunInstallPath, { recursive: true })
			} else {
				throw new Error(`Bun already exists. Version: ${await this.version()}`)
			}
		}
		// const bunDownloadUrl = getInferredBunDownloadUrl()
		const inferredBunDownloadFilename = `${this.inferredBunDownloadFilenameStem()}.zip`
		const bunDownloadUrl = `https://github.com/oven-sh/bun/releases/latest/download/${inferredBunDownloadFilename}`
		const urlAlive = await verifyUrlAlive(bunDownloadUrl)
		if (urlAlive) {
			const downloadPath = await join(await tempDir(), inferredBunDownloadFilename)
			if (await exists(downloadPath)) {
				await remove(downloadPath)
			}
			await info(`Downloading bun from ${bunDownloadUrl} to ${downloadPath}`)
			await download(bunDownloadUrl, downloadPath)
			await info(`Downloaded bun zip file to ${downloadPath}`)
			// TODO: bash unzip only works on Linux and MacOS, need to support Windows powershell
			// TODO: mac comes with unzip, but Linux doesn't, need to install unzip
			await unzip(downloadPath, await getAppRuntimePath())
			await info(`Unzipped bun to ${await getAppRuntimePath()}`)
			// verify installation
			if (!(await this.exists())) {
				await error(`Fail to install bun, bun not found at ${bunInstallPath}`)
				throw new Error(`Fail to install bun, bun not found at ${bunInstallPath}`)
			}
			await this.version()
		} else {
			await error(`Fail to download bun, URL unavailable ${bunDownloadUrl}`)
			throw new Error(`Fail to download bun, URL unavailable ${bunDownloadUrl}`)
		}
	}
	async exists() {
		return exists(await this.installPath())
	}

	async version() {
		let bunExePath = await this.exePath()
		let output: ChildProcess<string> = await Command.create(bunExePath, ["--version"]).execute()
		if (output.code !== 0) {
			throw new Error(`Fail to get bun version, error: ${output.stderr}`)
		}
		return output.stdout.trim()
	}
}

export class Deno extends Runtime {
	override exePath(): Promise<string> {
		throw new Error("Method not implemented.")
	}
	override install(options?: { overwrite: boolean }): Promise<void> {
		throw new Error("Method not implemented.")
	}
	override installPath(): Promise<string> {
		throw new Error("Method not implemented.")
	}
	override exists(): Promise<boolean> {
		throw new Error("Method not implemented.")
	}
	override version(): Promise<string> {
		throw new Error("Method not implemented.")
	}
}
