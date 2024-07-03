import { computed, map, atom } from "nanostores";
import { getAllApps, refreshApplicationsList } from "tauri-plugin-jarvis-api/commands";
import { AppInfo } from "tauri-plugin-jarvis-api/models";
import { appInfoToListItem } from "@/lib/extension/apps";

export const $apps = atom<AppInfo[]>([]);

refreshApplicationsList()
  .then(() => getAllApps())
  .then((apps) => {
    $apps.set(apps);
  });

export const $appListItems = computed($apps, (apps) => {
  console.log("triggered");

  return apps.map((app) => appInfoToListItem(app));
});
