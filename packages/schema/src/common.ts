import { enum_, literal, union, type InferOutput } from "valibot"

export enum IconTypeEnum {
  "iconify" = "iconify",
  "asset" = "asset",
  "remote-url" = "remote-url"
}
// export const IconType = union([literal("iconify"), literal("asset"), literal("remote-url")])
export const IconType = enum_(IconTypeEnum)
export type IconType = InferOutput<typeof IconType>
