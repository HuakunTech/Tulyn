import { z } from "zod";
import { appDataDir, join } from "@tauri-apps/api/path";

const appDataDirPath = await appDataDir();
export const extensionsFolder = await join(appDataDirPath, "extensions");
export const SUPABASE_URL = z
  .string()
  .min(10)
  .parse(import.meta.env.PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = z
  .string()
  .min(10)
  .parse(import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
export const SUPABASE_GRAPHQL_ENDPOINT = z
  .string()
  .min(10)
  .parse(import.meta.env.PUBLIC_SUPABASE_GRAPHQL_ENDPOINT);
