import type { TListItem } from "jarvis-api";
import { ExtensionBase } from "./base";
import { getAllApps, refreshApplicationsList } from "@/lib/commands/apps";
import { AppInfo } from "jarvis-api";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open } from "jarvis-api/ui";
import { ElNotification } from "element-plus";

function appInfoToListItem(app: AppInfo): TListItem {
  return {
    title: app.name,
    value: app.app_desktop_path,
    description: "",
    type: "Application",
    icon: app.icon_path
      ? { type: "remote-url", value: convertFileSrc(app.icon_path, "macicns") }
      : null,
    keywords: app.name.split(" "),
    identityFilter: false,
  };
}

export class AppsExtension extends ExtensionBase {
  apps: AppInfo[] = [];

  constructor() {
    super("Applications");
  }

  load(): Promise<void> {
    return refreshApplicationsList()
      .then(() => getAllApps())
      .then((apps) => {
        this.apps = apps;
      });
  }
  getInitialListItems(): TListItem[] {
    return this.apps.map((app) => appInfoToListItem(app)).slice(0, 10);
  }
  onSelect(item: TListItem): Promise<void> {
    const foundApp = this.apps.find((app) => app.app_desktop_path === item.value);
    if (!foundApp) {
      ElNotification({
        title: "App Not Found",
        type: "warning",
        position: "bottom-right",
      });
      return Promise.resolve();
    } else {
      open(foundApp.app_desktop_path);
      return Promise.resolve();
    }
  }
  search(searchTerm: string): TListItem[] {
    console.log("Search", searchTerm);

    if (searchTerm.trim() === "" || searchTerm.length < 2) {
      console.log("return initial", this.getInitialListItems());

      return this.getInitialListItems();
    } else {
      return this.apps
        .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((app) => appInfoToListItem(app));
    }
  }
}
