import { z } from "zod";
import { appDataDir, join } from "@tauri-apps/api/path";

const appDataDirPath = await appDataDir();
export const extensionsFolder = await join(appDataDirPath, "extensions");
export const SUPABASE_URL = z.string().min(10).parse(process.env.SUPABASE_URL);
export const SUPABASE_ANON_KEY = z.string().min(10).parse(process.env.SUPABASE_ANON_KEY);
