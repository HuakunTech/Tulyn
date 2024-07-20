import { loadAllExtensionsFromDisk } from "@/lib/commands/extensions"
import { $appConfig } from "@/lib/stores/appConfig"
import { useExtStore } from "@/stores/ext"
import {
  CustomUiCmd,
  ExtPackageJsonExtra,
  ListItemType,
  TemplateUiCmd,
  TListGroup,
  TListItem
} from "@jarvis/schema"
import { join } from "@tauri-apps/api/path"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import * as fs from "@tauri-apps/plugin-fs"
import { exists } from "@tauri-apps/plugin-fs"
import { debug, error, warn } from "@tauri-apps/plugin-log"
import {
  getServerPort,
  pathExists,
  registerExtensionWindow,
  unregisterExtensionWindow
} from "jarvis-api/commands"
import { atom, type WritableAtom } from "nanostores"
import { toast } from "vue-sonner"
import { type IExtensionBase } from "./base"

/**
 * Generate a value (unique identified) for a command in an extension
 * @param ext Extension Manifest
 * @param cmd Command in Extension
 * @returns
 */
export function generateItemValue(
  ext: ExtPackageJsonExtra,
  cmd: CustomUiCmd | TemplateUiCmd,
  isDev: boolean
) {
  return `${ext.jarvis.identifier}/${cmd.name}/${isDev ? "dev" : ""}`
}

export function cmdToItem(
  cmd: CustomUiCmd | TemplateUiCmd,
  manifest: ExtPackageJsonExtra,
  type: ListItemType,
  isDev: boolean
): TListItem {
  return {
    title: cmd.name,
    value: generateItemValue(manifest, cmd as CustomUiCmd, isDev),
    description: cmd.description ?? "",
    flags: { isDev, isRemovable: false },
    type,
    icon: manifest.jarvis.icon,
    keywords: cmd.cmds.map((c) => c.value), // TODO: handle regex as well
    identityFilter: true
  }
}

function createNewExtWindowForUiCmd(manifest: ExtPackageJsonExtra, cmd: CustomUiCmd, url: string) {
  return registerExtensionWindow(manifest.extPath).then(async (windowLabel) => {
    // try {
    //   console.log("Loading extension UI at", url);
    //   await axios.get(url);
    // } catch (error) {
    //   log.error(`Failed to load extension UI at ${url}: ${error}`);
    //   return ElNotification.error({
    //     title: "Failed to load extension UI",
    //     message: "Consider Running the TroubleShooter",
    //   });
    // }

    const window = new WebviewWindow(windowLabel, {
      center: cmd.window?.center ?? undefined,
      x: cmd.window?.x ?? undefined,
      y: cmd.window?.y ?? undefined,
      width: cmd.window?.width ?? undefined,
      height: cmd.window?.height ?? undefined,
      minWidth: cmd.window?.minWidth ?? undefined,
      minHeight: cmd.window?.minHeight ?? undefined,
      maxWidth: cmd.window?.maxWidth ?? undefined,
      maxHeight: cmd.window?.maxHeight ?? undefined,
      resizable: cmd.window?.resizable ?? undefined,
      title: cmd.window?.title ?? cmd.name,
      fullscreen: cmd.window?.fullscreen ?? undefined,
      focus: cmd.window?.focus ?? undefined,
      transparent: cmd.window?.transparent ?? undefined,
      maximized: cmd.window?.maximized ?? undefined,
      visible: cmd.window?.visible ?? undefined,
      decorations: cmd.window?.decorations ?? undefined,
      alwaysOnTop: cmd.window?.alwaysOnTop ?? undefined,
      alwaysOnBottom: cmd.window?.alwaysOnBottom ?? undefined,
      contentProtected: cmd.window?.contentProtected ?? undefined,
      skipTaskbar: cmd.window?.skipTaskbar ?? undefined,
      shadow: cmd.window?.shadow ?? undefined,
      theme: cmd.window?.theme ?? undefined,
      titleBarStyle: cmd.window?.titleBarStyle ?? undefined,
      hiddenTitle: cmd.window?.hiddenTitle ?? undefined,
      tabbingIdentifier: cmd.window?.tabbingIdentifier ?? undefined,
      maximizable: cmd.window?.maximizable ?? undefined,
      minimizable: cmd.window?.minimizable ?? undefined,
      closable: cmd.window?.closable ?? undefined,
      parent: cmd.window?.parent ?? undefined,
      visibleOnAllWorkspaces: cmd.window?.visibleOnAllWorkspaces ?? undefined,
      url
    })
    window.onCloseRequested(async (event) => {
      await unregisterExtensionWindow(window.label)
    })
  })
}

/**
 * Convert a manifest of Jarvis Extension to a list of TListItem, each represent a command
 * @param manifest
 * @returns
 */
export function manifestToCmdItems(manifest: ExtPackageJsonExtra, isDev: boolean): TListItem[] {
  const uiItems = manifest.jarvis.customUiCmds.map((cmd) =>
    cmdToItem(cmd, manifest, ListItemType.enum.UICmd, isDev)
  )
  const inlineItems = manifest.jarvis.templateUiCmds.map((cmd) =>
    cmdToItem(cmd, manifest, ListItemType.enum.InlineCmd, isDev)
  )
  return [...uiItems, ...inlineItems]
}

export class Extension implements IExtensionBase {
  manifests: ExtPackageJsonExtra[]
  extPath: string | undefined
  isDev: boolean
  extensionName: string
  //  $listItems, $listItemsDisplay
  $listItems: WritableAtom<TListItem[]>
  // $listItemsDisplay: ReadableAtom<TListItem[]>;

  constructor(name: string, extPath?: string, isDev: boolean = false) {
    this.extensionName = name
    this.extPath = extPath
    this.manifests = []
    this.isDev = isDev
    this.$listItems = atom([])
  }
  async load(): Promise<void> {
    if (!this.extPath || !pathExists(this.extPath)) {
      warn(`Extension path not found: ${this.extPath}`)
      this.manifests = []
    } else {
      debug(`Loading extensions from: ${this.extPath}`)
      return loadAllExtensionsFromDisk(this.extPath)
        .then((manifests) => {
          this.manifests = manifests
          this.$listItems.set(
            this.manifests.map((manifest) => manifestToCmdItems(manifest, this.isDev)).flat()
          )
        })
        .catch((err) => {
          console.error(err)
          toast.error(`Failed to load extensions from ${this.extPath}`)
          // toast.error(err);
        })
    }
  }
  default(): TListItem[] {
    return this.$listItems.get()
  }

  groups(): TListGroup[] {
    return this.manifests.map((manifest) => ({
      title: manifest.jarvis.name,
      identifier: manifest.jarvis.identifier,
      type: "Extension",
      icon: manifest.jarvis.icon,
      items: manifestToCmdItems(manifest, this.isDev),
      flags: { isDev: this.isDev, isRemovable: true }
    }))
  }

  uninstallExt(identifier: string): Promise<ExtPackageJsonExtra> {
    const found = this.manifests.find((m) => m.jarvis.identifier === identifier)
    console.log(found)
    if (found) {
      return fs.remove(found.extPath, { recursive: true }).then(() => {
        return found
      })
    } else {
      console.error("Extension not found", identifier)
      return Promise.reject("Extension not found")
    }
  }

  onSelect(item: TListItem): Promise<void> {
    this.manifests.forEach((manifest) => {
      if (item.type == "UI Command") {
        manifest.jarvis.customUiCmds.forEach(async (cmd) => {
          if (item.value === generateItemValue(manifest, cmd, this.isDev)) {
            let url = cmd.main
            if ($appConfig.value?.devExtLoadUrl && this.isDev && cmd.devMain) {
              url = cmd.devMain
            } else {
              if (cmd.main.startsWith("http")) {
                url = cmd.main
              } else {
                const port = await getServerPort()
                const postfix = !cmd.main.endsWith(".html") && !cmd.main.endsWith("/") ? "/" : ""
                url = `http://localhost:${port}/${this.isDev ? "dev-" : ""}extensions/${manifest.extFolderName}/${cmd.main}${postfix}`
              }
            }
            createNewExtWindowForUiCmd(manifest, cmd, url)
          }
        })
      } else if (item.type === "Inline Command") {
        manifest.jarvis.templateUiCmds.forEach(async (cmd) => {
          if (item.value === generateItemValue(manifest, cmd, this.isDev)) {
            const main = cmd.main
            const scriptPath = await join(manifest.extPath, main)
            if (!(await exists(scriptPath))) {
              toast.error(`Extension Script not found: ${scriptPath}`)
              error(`Extension Script not found: ${scriptPath}`)
              return
            }
            debug(`Running inline command: ${scriptPath}`)
            const extStore = useExtStore()
            extStore.setCurrentWorkerExt({
              extPath: manifest.extPath,
              cmdName: cmd.name
            })
            navigateTo("/worker-ext")
          }
        })
      } else if (item.type === "Remote Command") {
        // const remoteExt = new RemoteExtension();
        // const ext = findRemoteExt(item.value);
        // if (ext) {
        //   const window = new WebviewWindow("ext", {
        //     url: ext.url,
        //     title: item.title,
        //     titleBarStyle: "visible",
        //     // titleBarStyle: TitleBarStyle.parse(uiCmd.window?.titleBarStyle?.toLowerCase() ?? "visible"),
        //     // width: uiCmd.window?.width ?? undefined,
        //     // height: uiCmd.window?.height ?? undefined,
        //   });
        // }
      } else {
        toast.error(`Unknown command type: ${item.type}`)
        error(`Unknown command type: ${item.type}`)
      }
    })
    // const foundExt = this.
    return Promise.resolve()
  }
}
