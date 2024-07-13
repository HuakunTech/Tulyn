/**
 * This file was originally in tauri-plugin-jarvis, but I couldn't avoid bundling zod from @jarvis/schema in extension code
 * because the extension API package depends on tauri-plugin-jarvis. So I moved this file to desktop to make sure no dependencies
 * of extension API package are bundled in extension code.
 */
import { ExtPackageJson, ExtPackageJsonExtra } from "@jarvis/schema"
import { invoke } from "@tauri-apps/api/core"
import { basename, dirname, join } from "@tauri-apps/api/path"
import { BaseDirectory, exists, readDir, readTextFile } from "@tauri-apps/plugin-fs"
import { debug, error } from "@tauri-apps/plugin-log"
import { safeParse } from "valibot"

export function loadManifest(manifestPath: string): Promise<ExtPackageJsonExtra> {
  return readTextFile(manifestPath).then(async (content) => {
    const parse = safeParse(ExtPackageJson, JSON.parse(content))
    if (parse.issues) {
      error(`Fail to load extension ${manifestPath}. Error: ${parse.issues}`)
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
  // return invoke("plugin:jarvis|load_manifest", { manifestPath }).then((res) =>
  //   ExtPackageJsonExtra.parse(res)
  // )
}

export function loadAllExtensions(extensionsFolder: string): Promise<ExtPackageJsonExtra[]> {
  return readDir(extensionsFolder).then(async (dirEntries) => {
    const results: ExtPackageJsonExtra[] = []
    for (const dirEntry of dirEntries) {
      const extFullPath = await join(extensionsFolder, dirEntry.name)
      const manifestPath = await join(extFullPath, "package.json")
      try {
        if (!(await exists(manifestPath))) {
          continue
        }
      } catch (error) {
        continue
      }
      const content = await readTextFile(manifestPath)
      let jsonContent = {}
      try {
        jsonContent = JSON.parse(content)
      } catch (error) {
        console.error(error)
        continue
      }
      const parse = safeParse(ExtPackageJson, jsonContent)
      if (parse.issues) {
        console.log(parse.issues)

        error(
          `Fail to load extension (in loadAllExtensions) ${manifestPath}. Error: ${parse.issues}`
        )
        continue
      }
      results.push(
        Object.assign(parse.output, {
          extPath: extFullPath,
          extFolderName: dirEntry.name
        })
      )
    }
    return results
  })
  // debug(`loadAllExtensions extensions from ${extensionsFolder}`)
  // return invoke("plugin:jarvis|load_all_extensions", { extensionsFolder }).then(
  //   (res: any) =>
  //     res
  //       .map((x: unknown) => {
  //         console.log(extensionsFolder, "loaded", x)
  //         const parse = ExtPackageJsonExtra.safeParse(x)
  //         if (parse.error) {
  //           error(`Fail to load extension ${extensionsFolder}. Error: ${parse.error}`)
  //           console.error(parse.error)
  //           return null
  //         } else {
  //           debug(`Loaded extension ${parse.data.jarvis.identifier} from ${extensionsFolder}`)
  //           return parse.data
  //         }
  //       })
  //       .filter((x: ExtPackageJsonExtra | null) => x !== null) as ExtPackageJsonExtra[]
  // )
}
