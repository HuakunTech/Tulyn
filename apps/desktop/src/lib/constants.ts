import { z } from "zod";
import { appDataDir, join } from "@tauri-apps/api/path";
import { PermissionsEnum } from "tauri-plugin-jarvis-api";
import { loadEnvVarWithNotification } from "./utils/envvar";

const appDataDirPath = await appDataDir();
export const extensionsFolder = await join(appDataDirPath, "extensions");

/* ---------------------------- Get Supabase URL ---------------------------- */
export const SUPABASE_URL = await loadEnvVarWithNotification("PUBLIC_SUPABASE_URL");

/* ----------------------- Get Supabase Anonymous Key ----------------------- */
export const SUPABASE_ANON_KEY = await loadEnvVarWithNotification("PUBLIC_SUPABASE_ANON_KEY");

/* ------------------------ Supabase GraphQL Endpoint ----------------------- */
export const SUPABASE_GRAPHQL_ENDPOINT = await loadEnvVarWithNotification(
  "PUBLIC_SUPABASE_GRAPHQL_ENDPOINT",
);

export const FileStorageUrl = "";

// PermissionsEnum.
const PermissionExplain = z.record(
  PermissionsEnum,
  z.object({ displayName: z.string(), description: z.string() }),
);
type PermissionExplain = z.infer<typeof PermissionExplain>;
export const PERMISSIONS_EXPLANATION: PermissionExplain = {
  "clipboard-read": {
    displayName: "Read Clipboard",
    description:
      "Access to read clipboard data. Including text, html, RTF, image, file paths and monitoring clipboard content update.",
  },
  "clipboard-write": {
    displayName: "Write Clipboard",
    description:
      "Access to write clipboard data. Write text, html, RTF, image, file paths to clipboard.",
  },
  "fs-home": {
    displayName: "Home Directory",
    description: "Read and Write Access to the home directory",
  },
};
