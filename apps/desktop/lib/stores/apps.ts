import { appInfoToListItem } from "@/lib/extension/apps"
import { getAllApps, refreshApplicationsList } from "jarvis-api/commands"
import { atom, computed, map } from "nanostores"
import { AppInfo } from "tauri-plugin-jarvis-api/models"
