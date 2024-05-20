import { JarvisExtJson, TListItem } from "@jarvis/api";
import { map, computed } from "nanostores";
import { z } from "zod";
import { loadAllExtensions } from "../commands/manifest";
import { extensionsFolder } from "../constants";
import { $appConfig } from "./appConfig";
import { exists, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs";
import { pathExists } from "../commands/fs";

export const extensionsStoreSchema = z.object({
  manifests: JarvisExtJson.array(),
  devManifests: JarvisExtJson.array(),
});
z;
export type State = z.infer<typeof extensionsStoreSchema>;

export const $extensionsStore = map<State>({ manifests: [], devManifests: [] });

export function setManifests(manifests: JarvisExtJson[]) {
  $extensionsStore.setKey("manifests", manifests);
}

export function setDevManifests(manifests: JarvisExtJson[]) {
  $extensionsStore.setKey("devManifests", manifests);
}

export async function loadExtManifests() {
  //   const extFolderExists = await exists("extensions", {
  //     baseDir: BaseDirectory.AppData,
  //   });
  const extFolderExists = await pathExists(extensionsFolder);
  if (!extFolderExists) {
    await mkdir("extensions", { baseDir: BaseDirectory.AppData });
  }
  return loadAllExtensions(extensionsFolder).then((manifests) => {
    setManifests(manifests);
  });
}

export function loadDevExtManifests() {
  const extPath = $appConfig.get().devExtentionPath;
  if (!extPath) {
    return Promise.reject("No dev extension path set");
  }
  return loadAllExtensions(extPath).then((manifests) => {
    console.log("dev", manifests);

    setDevManifests(manifests);
  });
}

function manifestToCmdItems(manifest: JarvisExtJson): TListItem[] {
  const uiItems = manifest.uiCmds.map((cmd) => {
    return {
      title: cmd.name,
      value: `${manifest.identifier}/${cmd.name}`,
      description: "TODO",
      type: "UI Command",
      icon: null,
      keywords: cmd.cmds.map((c) => c.value), // TODO: handle regex as well
    };
  });
  const inlineItems = manifest.inlineCmds.map((cmd) => {
    return {
      title: cmd.name,
      value: `${manifest.identifier}/${cmd.name}`,
      description: "TODO",
      type: "Inline Command",
      icon: null,
      keywords: cmd.cmds.map((c) => c.value), // TODO: handle regex as well
    };
  });
  return [...uiItems, ...inlineItems];
}

export const $extensionListItems = computed($extensionsStore, (state): TListItem[] => {
  return state.manifests.map((m) => manifestToCmdItems(m)).flat();
});

export const $devExtensionListItems = computed($extensionsStore, (state): TListItem[] => {
  return state.devManifests.map((m) => manifestToCmdItems(m)).flat();
});

// create mapping value to 