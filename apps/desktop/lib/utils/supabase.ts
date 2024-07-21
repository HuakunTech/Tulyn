import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/constants"
import { type Database } from "@kunkunsh/supabase"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

export const supabaseClient = createClient<Database>(
  z.string().parse(SUPABASE_URL),
  z.string().parse(SUPABASE_ANON_KEY)
)

export function getFileUrl(path: string) {
  return supabaseClient.storage.from("extensions").getPublicUrl(path)
}
