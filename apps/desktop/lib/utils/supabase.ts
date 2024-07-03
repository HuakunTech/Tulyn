import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { type Database } from "@jarvis/supabase"
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/constants"

export const supabaseClient = createClient<Database>(
  z.string().parse(SUPABASE_URL),
  z.string().parse(SUPABASE_ANON_KEY)
)

export function getFileUrl(path: string) {
  return supabaseClient.storage.from("extensions").getPublicUrl(path)
}
