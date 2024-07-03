import { type IClipboard } from "../api/client-types"
import { defaultClientAPI, isMain } from "../client"
import { type Remote } from "@huakunshen/comlink"
import {
  hasFiles,
  hasHTML,
  hasImage,
  hasRTF,
  hasText,
  readFiles,
  readHtml,
  readImageBase64,
  readImageBinary,
  readRtf,
  readText,
  startMonitor,
  writeFiles,
  writeHtml,
  writeHtmlAndText,
  writeImageBase64,
  writeImageBinary,
  writeRtf,
  writeText
} from "tauri-plugin-clipboard-api"
import { type IClipboardServer } from "./server-types"

export function constructAPI(api: Remote<IClipboardServer>): IClipboard {
  return {
    readText: api.clipboardReadText,
    writeText: api.clipboardWriteText,
    readImageBase64: api.clipboardReadImageBase64,
    readImageBinary: api.clipboardReadImageBinary,
    writeImageBase64: api.clipboardWriteImageBase64,
    writeImageBinary: api.clipboardWriteImageBinary,
    readFiles: api.clipboardReadFiles,
    writeFiles: api.clipboardWriteFiles,
    readRtf: api.clipboardReadRtf,
    writeRtf: api.clipboardWriteRtf,
    readHtml: api.clipboardReadHtml,
    writeHtml: api.clipboardWriteHtml,
    writeHtmlAndText: api.clipboardWriteHtmlAndText,
    hasText: api.clipboardHasText,
    hasRTF: api.clipboardHasRTF,
    hasHTML: api.clipboardHasHTML,
    hasImage: api.clipboardHasImage,
    hasFiles: api.clipboardHasFiles,
    startMonitor: api.clipboardStartMonitor
  }
}
export const comlinkClipboard = constructAPI(defaultClientAPI)

export const nativeClipboard: IClipboard = {
  readText: readText,
  writeText: writeText,
  readImageBase64: readImageBase64,
  readImageBinary: readImageBinary,
  writeImageBase64: writeImageBase64,
  writeImageBinary: writeImageBinary,
  readFiles: readFiles,
  writeFiles: writeFiles,
  readRtf: readRtf,
  writeRtf: writeRtf,
  readHtml: readHtml,
  writeHtml: writeHtml,
  writeHtmlAndText: writeHtmlAndText,
  hasText: hasText,
  hasRTF: hasRTF,
  hasHTML: hasHTML,
  hasImage: hasImage,
  hasFiles: hasFiles,
  startMonitor: startMonitor
}

export const clipboard = isMain ? nativeClipboard : comlinkClipboard
