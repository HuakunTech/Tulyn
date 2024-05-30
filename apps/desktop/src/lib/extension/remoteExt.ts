import { z } from "zod";
import { atom, computed, type ReadableAtom, type WritableAtom } from "nanostores";
import type { IExtensionBase } from "./base";
import { ListItemType, type TListItem } from "jarvis-api";
// import { $remoteExtListItem } from "@/lib/stores/remoteExtensions";
import { Store } from "@tauri-apps/plugin-store";
import { ElMessage } from "element-plus";

export const RemoteExt = z.object({
  name: z.string().min(1),
  id: z.string().uuid(),
  url: z.string().url(),
  triggerCmds: z.array(z.string()).min(1),
});
export type RemoteExt = z.infer<typeof RemoteExt>;
export const RemoteExtState = RemoteExt.array();
export type RemoteExtState = z.infer<typeof RemoteExtState>;

function convertToListItem(rawExt: RemoteExt): TListItem {
  return {
    title: rawExt.name,
    value: rawExt.id,
    description: "Remote Extension",
    type: ListItemType.Enum["Remote Command"],
    icon: {
      type: "remote-url",
      value: `${rawExt.url}/favicon.ico`,
    },
    keywords: rawExt.triggerCmds,
    identityFilter: false,
    flags: { isDev: true },
  };
}

export class RemoteExtension implements IExtensionBase {
  extensionName: string = "Remote Extensions";
  $remoteExtensions: WritableAtom<RemoteExt[]>;
  $listItems: ReadableAtom<TListItem[]>;
  persistAppConfig: Store;

  constructor() {
    this.persistAppConfig = new Store("remoteExt.bin");
    this.$remoteExtensions = atom<RemoteExtState>([]);
    this.$listItems = computed(this.$remoteExtensions, (state): TListItem[] => {
      return state.map((x) => convertToListItem(x));
    });
    this.$remoteExtensions.subscribe((state, oldState) => {
      this.persistAppConfig.set("remoteExts", state);
      this.persistAppConfig.save();
    });
  }

  async load(): Promise<void> {
    const defaultState: RemoteExtState = [];
    const loadedConfig = await this.persistAppConfig.get("remoteExts");
    const parsedConfig = RemoteExtState.safeParse(loadedConfig);
    if (parsedConfig.success) {
      defaultState.push(...parsedConfig.data);
    } else {
      console.error(parsedConfig.error);
      ElMessage.error(`Failed to load remote extensions: ${parsedConfig.error.message}`);
    }
    this.$remoteExtensions.set(defaultState);
  }
  default(): TListItem[] {
    return this.$listItems.get();
  }

  findRemoteExt(uuid: string): RemoteExt | undefined {
    return this.$remoteExtensions.get().find((ext) => ext.id === uuid);
  }

  addRemoteExt(ext: RemoteExt) {
    this.$remoteExtensions.set([...this.$remoteExtensions.get(), ext]);
  }

  removeRemoteExt(uuid: string) {
    this.$remoteExtensions.set(this.$remoteExtensions.get().filter((ext) => ext.id !== uuid));
  }

  onSelect(item: TListItem): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
