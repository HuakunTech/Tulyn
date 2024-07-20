import { appDataDir, join } from "@tauri-apps/api/path"
import { AllTulynPermission } from "@tulyn/api/models"
import WorkerExt from "~/pages/worker-ext.vue"
// import { z } from "zod"
import { object, record, string, type InferOutput } from "valibot"
import { loadEnvVarWithNotification } from "./utils/envvar"

// const appDataDirPath = await appDataDir();
// export const extensionsFolder = await join(appDataDirPath, "extensions");
export function getExtensionsFolder() {
  return appDataDir().then((appDataDirPath) => join(appDataDirPath, "extensions"))
}
const rtConfig = useRuntimeConfig()
/* ---------------------------- Get Supabase URL ---------------------------- */
export const SUPABASE_URL = rtConfig.public.SUPABASE_URL
// export const SUPABASE_URL = await loadEnvVarWithNotification("SUPABASE_URL");

/* ----------------------- Get Supabase Anonymous Key ----------------------- */
// export const SUPABASE_ANON_KEY = await loadEnvVarWithNotification("SUPABASE_ANON_KEY");
export const SUPABASE_ANON_KEY = rtConfig.public.SUPABASE_ANON_KEY

/* ------------------------ Supabase GraphQL Endpoint ----------------------- */
// export const SUPABASE_GRAPHQL_ENDPOINT = await loadEnvVarWithNotification(
//   "SUPABASE_GRAPHQL_ENDPOINT",
// );
export const SUPABASE_GRAPHQL_ENDPOINT = rtConfig.public.SUPABASE_GRAPHQL_ENDPOINT

export const DevWindowLabel = "main-dev"
export const DebugWindowLabel = "main-debug"
export const SettingsWindowLabel = "main-settings"
export const FileStorageUrl = ""

// PermissionsEnum.
const PermissionExplain = record(
  AllTulynPermission,
  object({ displayName: string(), description: string() })
)
type PermissionExplain = InferOutput<typeof PermissionExplain>
export const PERMISSIONS_EXPLANATION: PermissionExplain = {
  "clipboard:read-all": {
    displayName: "Read Clipboard",
    description:
      "Access to read clipboard data. Including text, html, RTF, image, file paths and monitoring clipboard content update."
  },
  "clipboard:write-all": {
    displayName: "Write Clipboard",
    description:
      "Access to write clipboard data. Write text, html, RTF, image, file paths to clipboard."
  },
  "fs:read": {
    displayName: "Read File System",
    description: "Read files and directories from the file system."
  },
  "fs:write": {
    displayName: "Write File System",
    description: "Write files and directories to the file system."
  }
}

export const HTMLElementId = {
  MainSearchInput: "main-search-input",
  ActionPanelInputId: "action-panel-input",
  WorkerExtInputId: "worker-ext-input"
}
