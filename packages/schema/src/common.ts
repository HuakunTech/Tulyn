// import { z } from "zod"
import { enum_ } from "valibot"

export enum IconTypeEnum {
  "iconify" = "iconify",
  "asset" = "asset",
  "remote-url" = "remote-url"
}
export const IconType = enum_(IconTypeEnum)
