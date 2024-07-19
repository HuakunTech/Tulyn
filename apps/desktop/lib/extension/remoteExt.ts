import { ListItemType, TListGroup, TListItem } from "@jarvis/schema"
import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { info } from "@tauri-apps/plugin-log"
import { ElMessage } from "element-plus"
import { db } from "jarvis-api/commands"
import { CmdType, ExtCmd, Icon, IconType } from "jarvis-api/models"
import { atom, computed, task, type ReadableAtom, type WritableAtom } from "nanostores"
import {
  array,
  minLength,
  number,
  object,
  parse,
  pipe,
  safeParse,
  string,
  url,
  uuid,
  type InferOutput
} from "valibot"
import type { IExtensionBase } from "./base"

export const RemoteCmd = object({
  name: pipe(string(), minLength(1)),
  id: number(),
  url: pipe(string(), url()),
  triggerCmds: pipe(array(string()), minLength(1))
})
export type RemoteCmd = InferOutput<typeof RemoteCmd>
export const RemoteExtState = array(RemoteCmd)
export type RemoteExtState = InferOutput<typeof RemoteExtState>

function convertRawCmdToRemoteExt(rawExt: ExtCmd): RemoteCmd {
  return {
    name: rawExt.name,
    id: rawExt.cmdId,
    url: rawExt.data,
    triggerCmds: rawExt.alias ? [rawExt.alias, "remote"] : ["remote"]
  }
}

function convertToListItem(rawExt: RemoteCmd): TListItem {
  return {
    title: rawExt.name,
    value: rawExt.id.toString(),
    description: "Remote Extension",
    type: ListItemType.enum.RemoteCmd,
    icon: {
      type: IconType.enum.RemoteUrl,
      value: rawExt.url + "/favicon.ico"
    },
    keywords: ["remote", ...rawExt.triggerCmds],
    identityFilter: false,
    flags: { isDev: true, isRemovable: true }
  }
}

export class RemoteExtension implements IExtensionBase {
  extensionName: string = "Remote Extensions"
  $remoteExtensions: WritableAtom<RemoteCmd[]>
  $listItems: ReadableAtom<TListItem[]>
  remoteExtDbId: number | undefined

  constructor() {
    this.$remoteExtensions = atom<RemoteExtState>([])
    this.$listItems = computed(this.$remoteExtensions, (state): TListItem[] => {
      return state.map((x) => convertToListItem(x))
    })
  }

  async load(): Promise<void> {
    const dbRemoteExt = await db.getExtRemote()
    this.remoteExtDbId = dbRemoteExt.extId
    const cmds = await db.getCommandsByExtId(dbRemoteExt.extId)
    const remoteCmds = cmds.map(convertRawCmdToRemoteExt)
    this.$remoteExtensions.set(remoteCmds)
  }

  default(): TListItem[] {
    return this.$listItems.get()
  }

  groups(): TListGroup[] {
    return [
      {
        title: this.extensionName,
        identifier: "remote-ext",
        type: "Remote Extension",
        icon: parse(Icon, {
          type: "iconify",
          value: "mdi:remote"
        }),
        items: this.default(),
        flags: { isDev: true, isRemovable: false }
      }
    ]
  }

  findRemoteExt(cmdId: number): RemoteCmd | undefined {
    return this.$remoteExtensions.get().find((ext) => ext.id === cmdId)
  }

  async addRemoteExt(ext: Omit<RemoteCmd, "id">) {
    if (!this.remoteExtDbId) {
      await this.load() // remoteExtDbId should be set in load()
    }
    // Allow duplicate remote extension, there is no unique identifier.
    // User can always remove the duplicate in settings.
    console.log({
      extId: parse(number(), this.remoteExtDbId),
      name: ext.name,
      type: CmdType.enum.Remote,
      data: ext.url
    })

    await db.createCommand({
      extId: parse(number(), this.remoteExtDbId),
      name: ext.name,
      cmdType: CmdType.enum.Remote,
      data: ext.url
    })
  }

  removeRemoteCmd(cmdId: number) {
    return db.deleteCommandById(cmdId)
  }

  onSelect(item: TListItem): Promise<void> {
    const ext = this.findRemoteExt(parseInt(item.value))
    if (!ext) {
      return Promise.reject("Remote Extension not found")
    }
    // TODO: rethink the design of remote extension, how it works
    new WebviewWindow("ext-remote", {
      url: ext.url
    })
    return Promise.resolve()
  }
}
