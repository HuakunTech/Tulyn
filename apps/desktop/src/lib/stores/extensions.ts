import { InlineCmd, JarvisExtJson, JarvisExtJsonExtra, TListItem, UiCmd } from "@jarvis/api";
import { map, computed } from "nanostores";
import { z } from "zod";
import { loadAllExtensions } from "../commands/manifest";
import { extensionsFolder } from "../constants";
import { $appConfig } from "./appConfig";
import { exists, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { pathExists } from "../commands/fs";

export const extensionsStoreSchema = z.object({
  manifests: JarvisExtJsonExtra.array(),
  devManifests: JarvisExtJsonExtra.array(),
});

export type State = z.infer<typeof extensionsStoreSchema>;

export const $extensionsStore = map<State>({ manifests: [], devManifests: [] });

export function setManifests(manifests: JarvisExtJsonExtra[]) {
  $extensionsStore.setKey("manifests", manifests);
}

export function setDevManifests(manifests: JarvisExtJsonExtra[]) {
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
    setDevManifests(manifests);
  });
}

export function loadAllExtensionsManifest() {
  loadExtManifests();
  loadDevExtManifests();
}

/**
 * Generate a value (unique identified) for a command in an extension
 * @param ext Extension Manifest
 * @param cmd Command in Extension
 * @returns
 */
export function generateExtensionValue(ext: JarvisExtJsonExtra, cmd: UiCmd | InlineCmd) {
  return `${ext.identifier}/${cmd.name}`;
}

/**
 * Convert a manifest of Jarvis Extension to a list of TListItem, each represent a command
 * @param manifest
 * @returns
 */
export function manifestToCmdItems(manifest: JarvisExtJsonExtra): TListItem[] {
  const uiItems = manifest.uiCmds.map((cmd) => {
    return {
      title: cmd.name,
      value: generateExtensionValue(manifest, cmd as UiCmd),
      description: `UI Extension`,
      type: "UI Command",
      icon: {
        value: manifest.icon.icon,
        type: manifest.icon.type,
      },
      keywords: cmd.cmds.map((c) => c.value), // TODO: handle regex as well
    };
  });
  const inlineItems = manifest.inlineCmds.map((cmd) => {
    return {
      title: cmd.name,
      value: generateExtensionValue(manifest, cmd as InlineCmd),
      description: "Inline Extension",
      type: "Inline Command",
      icon: {
        value: manifest.icon.icon,
        type: manifest.icon.type,
      },
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

export const $allExtensionListItems = computed($extensionsStore, (state): TListItem[] => {
  return $devExtensionListItems.get().concat($extensionListItems.get());
  // return [...state.manifests, ...state.devManifests].map((m) => manifestToCmdItems(m)).flat();
});

export const cmdType = z.enum(["UI", "Inline"]);

export const ExtCmdBundle = z.object({
  cmd: z.union([UiCmd, InlineCmd]),
  manifest: JarvisExtJsonExtra,
  cmdType: cmdType,
  isDev: z.boolean(), // extension cmd is from dev extension folder
});
export type ExtCmdBundle = z.infer<typeof ExtCmdBundle>;

export const CmdValueMap = z.record(ExtCmdBundle);
export type CmdValueMap = z.infer<typeof CmdValueMap>;

// create mapping value to command
export const $extCmdMap = computed($extensionsStore, (state) => {
  const map: CmdValueMap = {};
  state.manifests.forEach((m) => {
    m.uiCmds.forEach((cmd) => {
      map[generateExtensionValue(m, cmd)] = {
        cmd,
        manifest: m,
        cmdType: cmdType.Enum.UI,
        isDev: false,
      };
    });
    m.inlineCmds.forEach((cmd) => {
      map[generateExtensionValue(m, cmd as InlineCmd)] = {
        cmd: cmd as InlineCmd,
        manifest: m,
        cmdType: cmdType.Enum.Inline,
        isDev: false,
      };
    });
  });

  state.devManifests.forEach((m) => {
    m.uiCmds.forEach((cmd) => {
      map[generateExtensionValue(m, cmd)] = {
        cmd,
        manifest: m,
        cmdType: cmdType.Enum.UI,
        isDev: true,
      };
    });
    m.inlineCmds.forEach((cmd) => {
      map[generateExtensionValue(m, cmd as InlineCmd)] = {
        cmd: cmd as InlineCmd,
        manifest: m,
        cmdType: cmdType.Enum.Inline,
        isDev: true,
      };
    });
  });
  return map;
});

/**
 * Obtain extension command from a map by the value (unique identifier) used in list item
 * @param extCmdListItemValue 
 * @returns 
 */
export function getCmdFromValue(extCmdListItemValue: string): ExtCmdBundle | undefined {
  return $extCmdMap.get()[extCmdListItemValue];
}
