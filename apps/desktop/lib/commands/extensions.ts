/**
 * This file was originally in tauri-plugin-jarvis, but I couldn't avoid bundling zod from @jarvis/schema in extension code
 * because the extension API package depends on tauri-plugin-jarvis. So I moved this file to desktop to make sure no dependencies
 * of extension API package are bundled in extension code.
 */
import { ExtPackageJsonExtra } from "@jarvis/schema"
import { invoke } from "@tauri-apps/api/core"
import { debug, error } from "@tauri-apps/plugin-log"

export function loadManifest(manifestPath: string): Promise<ExtPackageJsonExtra> {
  return invoke("plugin:jarvis|load_manifest", { manifestPath }).then((res) =>
    ExtPackageJsonExtra.parse(res)
  )
}

export function loadAllExtensions(extensionsFolder: string): Promise<ExtPackageJsonExtra[]> {
  return invoke("plugin:jarvis|load_all_extensions", { extensionsFolder }).then(
    (res: any) =>
      res
        .map((x: unknown) => {
          console.log(x)

          const parse = ExtPackageJsonExtra.safeParse(x)
          if (parse.error) {
            error(`Fail to load extension ${extensionsFolder}. Error: ${parse.error}`)
            console.error(parse.error)

            return null
          } else {
            debug(`Loaded extension ${parse.data.jarvis.identifier} from ${extensionsFolder}`)
            return parse.data
          }
        })
        .filter((x: ExtPackageJsonExtra | null) => x !== null) as ExtPackageJsonExtra[]
  )
}
