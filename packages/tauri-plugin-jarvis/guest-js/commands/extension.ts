import { ExtPackageJson, ExtPackageJsonExtra } from "@jarvis/schema"
import { invoke } from "@tauri-apps/api/core"
import { basename, dirname, join } from "@tauri-apps/api/path"
import { readDir, readTextFile } from "@tauri-apps/plugin-fs"
import { debug, error } from "@tauri-apps/plugin-log"
import { db } from "tauri-plugin-jarvis-api/commands"
import { safeParse } from "valibot"
import { generateJarvisPluginCommand } from "../common"
import { ExtensionLabelMap } from "../models/extension"

export function isWindowLabelRegistered(label: string): Promise<boolean> {
  return invoke(generateJarvisPluginCommand("is_window_label_registered"), { label })
}

/**
 * @param extensionPath
 * @returns Window Label
 */
export function registerExtensionWindow(extensionPath: string): Promise<string> {
  return invoke(generateJarvisPluginCommand("register_extension_window"), { extensionPath })
}

export function unregisterExtensionWindow(label: string): Promise<void> {
  return invoke(generateJarvisPluginCommand("unregister_extension_window"), { label })
}

export function getExtLabelMap(): Promise<ExtensionLabelMap> {
  return invoke(generateJarvisPluginCommand("get_ext_label_map"))
}

export function loadExtensionManifestFromDisk(manifestPath: string): Promise<ExtPackageJsonExtra> {
  return readTextFile(manifestPath).then(async (content) => {
    const parse = safeParse(ExtPackageJson, JSON.parse(content))
    if (parse.issues) {
      error(`Fail to load extension from ${manifestPath}. See console for parse error.`)
      console.error(parse.issues)
      throw new Error(`Invalid manifest: ${manifestPath} - ${parse.issues}`)
    } else {
      debug(`Loaded extension ${parse.output.jarvis.identifier} from ${manifestPath}`)
      const extPath = await dirname(manifestPath)
      const extFolderName = await basename(extPath)
      return Object.assign(parse.output, {
        extPath,
        extFolderName
      })
    }
  })
}

export function loadAllExtensionsFromDisk(
  extensionsFolder: string
): Promise<ExtPackageJsonExtra[]> {
  return readDir(extensionsFolder).then(async (dirEntries) => {
    const results: ExtPackageJsonExtra[] = []
    for (const dirEntry of dirEntries) {
      const extFullPath = await join(extensionsFolder, dirEntry.name)
      const manifestPath = await join(extFullPath, "package.json")
      const extPkgJson = await loadExtensionManifestFromDisk(manifestPath)
      const extInDb = await db.getExtensionByIdentifier(extPkgJson.jarvis.identifier)
      if (!extInDb) {
        // create this extension in database
        await db.createExtension({
          identifier: extPkgJson.jarvis.identifier,
          version: extPkgJson.version
        })
      }
      results.push(
        Object.assign(extPkgJson, {
          extPath: extFullPath,
          extFolderName: dirEntry.name
        })
      )
    }
    return results
  })
}
