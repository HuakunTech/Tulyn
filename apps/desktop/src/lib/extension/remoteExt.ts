import { z } from "zod";
import { atom, computed, type ReadableAtom, type WritableAtom, task } from "nanostores";
import type { IExtensionBase } from "./base";
import {
  TListItem,
  ListItemType,
  IconType,
  TListGroup,
  Icon,
} from "tauri-plugin-jarvis-api/models";
import { Store } from "@tauri-apps/plugin-store";
import { ElMessage } from "element-plus";
import axios from "axios";

export const RemoteExt = z.object({
  name: z.string().min(1),
  id: z.string().uuid(),
  url: z.string().url(),
  triggerCmds: z.array(z.string()).min(1),
});
export type RemoteExt = z.infer<typeof RemoteExt>;
export const RemoteExtState = RemoteExt.array();
export type RemoteExtState = z.infer<typeof RemoteExtState>;

// async function getFavicon(url: string): Promise<Icon> {
//   return axios
//     .get(url + "/favicon.ico")
//     .then((res) => {
//       return Icon.parse({
//         type: "remote-url",
//         value: url + "/favicon.ico",
//       });
//     })
//     .catch((err) => {
//       console.log(url, err);

//       return Icon.parse({
//         type: "iconify",
//         value: "mdi:web",
//       });
//     });
// }

function convertToListItem(rawExt: RemoteExt): TListItem {
  return {
    title: rawExt.name,
    value: rawExt.id, // uuid of command can be used to identify list item
    description: "Remote Extension",
    type: ListItemType.Enum["Remote Command"],
    icon: {
      type: IconType.Enum["remote-url"],
      value: rawExt.url + "/favicon.ico",
    },
    // icon: await getFavicon(rawExt.url),
    keywords: ["remote", ...rawExt.triggerCmds],
    identityFilter: false,
    flags: { isDev: true, isRemovable: true },
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
  }

  async load(): Promise<void> {
    const defaultState: RemoteExtState = [];
    const loadedConfig = await this.persistAppConfig.get("remoteExts");
    if (!loadedConfig === null) {
      // not null means config is initialized, if parse error is thrown then it's a problem
      const parsedConfig = RemoteExtState.safeParse(loadedConfig);
      if (parsedConfig.success) {
        defaultState.push(...parsedConfig.data);
      } else {
        console.error(parsedConfig.error);
        ElMessage.error(`Failed to load remote extensions: ${parsedConfig.error.message}`);
      }
    }
    this.$remoteExtensions.set(defaultState);
    // !Subscribe is replaced by save(). save() is called in addRemoteExt() and removeRemoteCmd().
    // !Subscribe could have problem when this class is used in multiple places (instanciated multiple times), data could be erased.
    // this.$remoteExtensions.subscribe((state, oldState) => {
    //   console.log("Subscribe", state);
    //   this.persistAppConfig.set("remoteExts", state);
    //   this.persistAppConfig.save();
    // });
  }
  default(): TListItem[] {
    return this.$listItems.get();
  }

  groups(): TListGroup[] {
    return [
      {
        title: this.extensionName,
        identifier: "remote-ext",
        type: "Remote Extension",
        icon: Icon.parse({
          type: "iconify",
          value: "mdi:remote",
        }),
        items: this.default(),
        flags: { isDev: true, isRemovable: false },
      },
    ];
  }
  findRemoteExt(uuid: string): RemoteExt | undefined {
    return this.$remoteExtensions.get().find((ext) => ext.id === uuid);
  }

  async addRemoteExt(ext: RemoteExt) {
    await this.load();
    console.log("addRemoteExt", ext);
    this.$remoteExtensions.set([...this.$remoteExtensions.get(), ext]);
    console.log("Save ", this.$remoteExtensions.get());
    this.save();
  }

  save() {
    this.persistAppConfig.set("remoteExts", this.$remoteExtensions.get());
    this.persistAppConfig.save();
  }

  async removeRemoteCmd(uuid: string) {
    await this.load();
    this.$remoteExtensions.set(this.$remoteExtensions.get().filter((ext) => ext.id !== uuid));
    this.save();
  }

  onSelect(item: TListItem): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
