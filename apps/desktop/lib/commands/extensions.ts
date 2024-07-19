/**
 * This file was originally in tauri-plugin-jarvis, but I couldn't avoid bundling zod from @jarvis/schema in extension code
 * because the extension API package depends on tauri-plugin-jarvis. So I moved this file to desktop to make sure no dependencies
 * of extension API package are bundled in extension code.
 */
import { ExtPackageJson, ExtPackageJsonExtra } from "@jarvis/schema"
import { basename, dirname, join } from "@tauri-apps/api/path"
import { readDir, readTextFile } from "@tauri-apps/plugin-fs"
import { debug, error } from "@tauri-apps/plugin-log"
import { db } from "tauri-plugin-jarvis-api/commands"
import { safeParse } from "valibot"

export function loadManifest(manifestPath: string): Promise<ExtPackageJsonExtra> {
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

export function loadAllExtensions(extensionsFolder: string): Promise<ExtPackageJsonExtra[]> {
  return readDir(extensionsFolder).then(async (dirEntries) => {
    const results: ExtPackageJsonExtra[] = []
    for (const dirEntry of dirEntries) {
      const extFullPath = await join(extensionsFolder, dirEntry.name)
      const manifestPath = await join(extFullPath, "package.json")
      const extPkgJson = await loadManifest(manifestPath)
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
