import { map, computed, atom } from "nanostores";
import { Store } from "@tauri-apps/plugin-store";
import { z } from "zod";
import { ListItemType, type TListItem } from "jarvis-api";

const persistAppConfig = new Store("remoteExt.bin");

export const RemoteExt = z.object({
  name: z.string().min(1),
  id: z.string().uuid(),
  url: z.string().url(),
  triggerCmds: z.array(z.string()).min(1),
});
export type RemoteExt = z.infer<typeof RemoteExt>;
export const RemoteExtState = RemoteExt.array();
export type RemoteExtState = z.infer<typeof RemoteExtState>;

const defaultState: RemoteExtState = [];

const loadedConfig = await persistAppConfig.get("remoteExts");

const parsedConfig = RemoteExtState.safeParse(loadedConfig);
if (parsedConfig.success) {
  defaultState.push(...parsedConfig.data);
}

export const $remoteExtensions = atom<RemoteExtState>(defaultState);

export const $remoteExtListItem = computed($remoteExtensions, (state): TListItem[] => {
  return state.map((ext) => ({
    title: ext.name,
    value: ext.id,
    description: "Remote Extension",
    type: ListItemType.Enum["Remote Command"],
    icon: {
      type: "remote-url",
      value: `${ext.url}/favicon.ico`,
    },
    keywords: ext.triggerCmds,
  }));
});

export function findRemoteExt(uuid: string): RemoteExt | undefined {
  return $remoteExtensions.get().find((ext) => ext.id === uuid);
}

export function addRemoteExt(ext: RemoteExt) {
  $remoteExtensions.set([...$remoteExtensions.get(), ext]);
}

export function removeRemoteExt(uuid: string) {
  $remoteExtensions.set($remoteExtensions.get().filter((ext) => ext.id !== uuid));
}

$remoteExtensions.subscribe((state, oldState) => {
  persistAppConfig.set("remoteExts", state);
  persistAppConfig.save();
});
