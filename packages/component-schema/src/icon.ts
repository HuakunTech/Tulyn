import { enum_, literal, object, string, type InferOutput } from "valibot"
import { NodeNameEnum } from "./constants"

/* -------------------------------------------------------------------------- */
/*                                    Icon                                    */
/* -------------------------------------------------------------------------- */
export enum IconEnum {
  Iconify = "iconify",
  RemoteUrl = "remote-url",
  Svg = "svg",
  Base64PNG = "base64-png",
  IndexNumber = "index-number"
}
export const IconType = enum_(IconEnum)
export type IconType = InferOutput<typeof IconType>

export const Icon = object({
  nodeName: literal(NodeNameEnum.Icon),
  type: IconType,
  value: string()
})
export type Icon = InferOutput<typeof Icon>
