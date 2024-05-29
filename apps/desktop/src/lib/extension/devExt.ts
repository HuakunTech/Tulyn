import {
  ListItemType,
  type ExtPackageJsonExtra,
  type InlineCmd,
  type TListItem,
  type UiCmd,
} from "jarvis-api";
import { ExtensionBase } from "./base";
import { $appConfig } from "@/lib/stores/appConfig";
import { loadAllExtensions } from "@/lib/commands/manifest";
import { pathExists } from "@/lib/commands/fs";

/**
 * Generate a value (unique identified) for a command in an extension
 * @param ext Extension Manifest
 * @param cmd Command in Extension
 * @returns
 */
export function generateExtensionValue(
  ext: ExtPackageJsonExtra,
  cmd: UiCmd | InlineCmd,
  isDev: boolean,
) {
  return `${ext.jarvis.identifier}/${cmd.name}/${isDev ? "dev" : ""}`;
}

export function cmdToItem(
  cmd: UiCmd | InlineCmd,
  manifest: ExtPackageJsonExtra,
  type: ListItemType,
  isDev: boolean,
): TListItem {
  return {
    title: cmd.name,
    value: generateExtensionValue(manifest, cmd as UiCmd, isDev),
    description: cmd.description ?? "",
    isDev,
    type,
    icon: {
      value: manifest.jarvis.icon.icon,
      type: manifest.jarvis.icon.type,
    },
    keywords: cmd.cmds.map((c) => c.value), // TODO: handle regex as well
    identityFilter: true,
  };
}

/**
 * Convert a manifest of Jarvis Extension to a list of TListItem, each represent a command
 * @param manifest
 * @returns
 */
export function manifestToCmdItems(manifest: ExtPackageJsonExtra, isDev: boolean): TListItem[] {
  const uiItems = manifest.jarvis.uiCmds.map((cmd) =>
    cmdToItem(cmd, manifest, ListItemType.Enum["UI Command"], isDev),
  );
  const inlineItems = manifest.jarvis.inlineCmds.map((cmd) =>
    cmdToItem(cmd, manifest, ListItemType.Enum["Inline Command"], isDev),
  );
  return [...uiItems, ...inlineItems];
}

export class DevExtension extends ExtensionBase {
  manifests: ExtPackageJsonExtra[];
  extPath: string | undefined;
  isDev: boolean;

  constructor(name: string, extPath?: string, isDev: boolean = false) {
    super(name);
    this.extPath = extPath;
    this.manifests = [];
    this.isDev = isDev;
  }
  async load(): Promise<void> {
    if (!this.extPath || !pathExists(this.extPath)) {
      this.manifests = [];
    } else {
      this.manifests = await loadAllExtensions(this.extPath);
    }
  }
  getInitialListItems(): TListItem[] {
    return [];
  }

  get uiCmds(): UiCmd[] {
    return this.manifests.flatMap((m) => m.jarvis.uiCmds);
  }

  onSelect(item: TListItem): Promise<void> {
    // const foundExt = this.
    return Promise.resolve();
  }
  search(searchTerm: string): TListItem[] {
    if (searchTerm.trim() === "" || searchTerm.length < 2) {
      return this.getInitialListItems();
    } else {
      return this.manifests
        .map((manifest) => manifestToCmdItems(manifest, this.isDev))
        .flat()
        .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  }
}
