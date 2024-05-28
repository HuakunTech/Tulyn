import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "@jarvis/ext-api";

export const supabaseClient = createClient<Database>(
  z.string().parse(import.meta.env.PUBLIC_SUPABASE_URL),
  z.string().parse(import.meta.env.PUBLIC_SUPABASE_ANON_KEY),
);

export function getFileUrl(path: string) {
  return supabaseClient.storage.from("extensions").getPublicUrl(path);
}
