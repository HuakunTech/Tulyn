import { PermissionsEnum } from "@jarvis/schema"
import { appDataDir, join } from "@tauri-apps/api/path"
import { z } from "zod"
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
const PermissionExplain = z.record(
  PermissionsEnum,
  z.object({ displayName: z.string(), description: z.string() })
)
type PermissionExplain = z.infer<typeof PermissionExplain>
export const PERMISSIONS_EXPLANATION: PermissionExplain = {
  "clipboard-read": {
    displayName: "Read Clipboard",
    description:
      "Access to read clipboard data. Including text, html, RTF, image, file paths and monitoring clipboard content update."
  },
  "clipboard-write": {
    displayName: "Write Clipboard",
    description:
      "Access to write clipboard data. Write text, html, RTF, image, file paths to clipboard."
  },
  "fs-home": {
    displayName: "Home Directory",
    description: "Read and Write Access to the home directory"
  }
}
