import { appDataDir, join } from "@tauri-apps/api/path";

const appDataDirPath = await appDataDir();
export const extensionsFolder = await join(appDataDirPath, "extensions");

