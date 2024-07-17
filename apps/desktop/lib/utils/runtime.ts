import { appDataDir, join, tempDir } from "@tauri-apps/api/path"
import { exists, remove } from "@tauri-apps/plugin-fs"
import { debug, error, info } from "@tauri-apps/plugin-log"
import { arch, platform } from "@tauri-apps/plugin-os"
import { download } from "@tauri-apps/plugin-upload"
import { verifyUrlAlive } from "~/lib/utils/request"
import { Command, executeBashScript, type ChildProcess } from "tauri-plugin-shellx-api"

export function getInferredBunDownloadFilenameStem() {
  let _platform: string = platform()
  if (_platform === "macos") {
    _platform = "darwin"
  }
  return `bun-${_platform}-${arch()}`
}

export function getInferredBunDownloadFilename(): string {
  return `${getInferredBunDownloadFilenameStem()}.zip`
}

export function getInferredBunDownloadUrl() {
  return `https://github.com/oven-sh/bun/releases/latest/download/${getInferredBunDownloadFilename()}`
}

export async function getAppRuntimePath() {
  return await join(await appDataDir(), "runtime")
}

export async function getBunInstallPath() {
  return await join(await getAppRuntimePath(), getInferredBunDownloadFilenameStem())
}

export async function getBunExePath() {
  return await join(await getBunInstallPath(), "bun")
}

export async function bunExists(): Promise<boolean> {
  return await exists(await getBunInstallPath())
}

export async function getBunVersion(): Promise<string> {
  let bunExePath = await getBunExePath()
  let output: ChildProcess<string> = await Command.create(bunExePath, ["--version"]).execute()
  if (output.code !== 0) {
    throw new Error(`Fail to get bun version, error: ${output.stderr}`)
  }
  return output.stdout.trim()
}

/**
 * Install bun to the runtime directory of appDataDir
 * @param options use overwrite to force overwrite existing bun
 * @returns installed bun version
 */
export async function installBun(
  options: { overwrite: boolean } = { overwrite: false }
): Promise<string> {
  const bunInstallPath = await getBunInstallPath()
  const bunExePath = await getBunExePath()
  await debug(`getBunExePath: ${getBunExePath}`)
  if (await exists(bunExePath)) {
    if (options.overwrite) {
      await remove(bunInstallPath, { recursive: true })
    } else {
      throw new Error(`Bun already exists. Version: ${await getBunVersion()}`)
    }
  }
  const bunDownloadUrl = getInferredBunDownloadUrl()
  const bunDownloadFilename = getInferredBunDownloadFilename()
  const urlAlive = await verifyUrlAlive(bunDownloadUrl)
  if (urlAlive) {
    const downloadPath = await join(await tempDir(), bunDownloadFilename)
    if (await exists(downloadPath)) {
      await remove(downloadPath)
    }
    await info(`Downloading bun from ${bunDownloadUrl} to ${downloadPath}`)
    await download(bunDownloadUrl, downloadPath)
    await info(`Downloaded bun zip file to ${downloadPath}`)
    const output = await executeBashScript(
      `unzip ${downloadPath} -d "${await getAppRuntimePath()}"`
    )
    if (output.code !== 0) {
      await error(`Fail to unzip bun, error: ${output.stderr}`)
      throw new Error(`Fail to unzip bun, error: ${output.stderr}`)
    }
    await info(`Unzipped bun to ${await getAppRuntimePath()}`)
    // verify installation
    if (!(await bunExists())) {
      await error(`Fail to install bun, bun not found at ${bunInstallPath}`)
      throw new Error(`Fail to install bun, bun not found at ${bunInstallPath}`)
    }
    return await getBunVersion()
  } else {
    await error(`Fail to download bun, URL unavailable ${bunDownloadUrl}`)
    throw new Error(`Fail to download bun, URL unavailable ${bunDownloadUrl}`)
  }
}
