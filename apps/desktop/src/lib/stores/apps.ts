import { AppInfo } from "jarvis-api";
import { computed, map, atom } from "nanostores";
import { getAllApps, refreshApplicationsList } from "@/lib/commands/apps";
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
