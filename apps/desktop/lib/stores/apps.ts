import { computed, map, atom } from "nanostores"
import { getAllApps, refreshApplicationsList } from "tauri-plugin-jarvis-api/commands"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
import { appInfoToListItem } from "@/lib/extension/apps"
