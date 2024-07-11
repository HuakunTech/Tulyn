import { invoke } from "@tauri-apps/api/core"
import * as v from "valibot"
import { generateJarvisPluginCommand } from "../common"

export const ClipboardContentType = v.union([
  v.literal("Text"),
  v.literal("Image"),
  v.literal("Html"),
  v.literal("Rtf")
  // z.literal("File"),
])
export type ClipboardContentType = v.InferOutput<typeof ClipboardContentType>
export const ClipboardRecord = v.object({
  value: v.string(),
  contentType: ClipboardContentType,
  timestamp: v.number(),
  text: v.string()
})
export type ClipboardRecord = v.InferOutput<typeof ClipboardRecord>
export const ClipboardRecords = v.array(ClipboardRecord)
export type ClipboardRecords = v.InferOutput<typeof ClipboardRecords>

export function addClipboardHistory(value: string) {
  return invoke<null>(generateJarvisPluginCommand("add_to_history"), { value })
}

export function getClipboardHistory() {
  return invoke<ClipboardRecord[]>(generateJarvisPluginCommand("get_history")).then((records) => {
    return v.parse(ClipboardRecords, records)
  })
}

// export function setCandidateFilesForServer(files: string[]) {
//   return invoke<null>(generateJarvisPluginCommand("set_candidate_files"), { files })
// }
