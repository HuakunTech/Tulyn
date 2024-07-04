import { appInfoToListItem } from "@/lib/extension/apps"
import { atom, computed, map } from "nanostores"
import { getAllApps, refreshApplicationsList } from "tauri-plugin-jarvis-api/commands"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
