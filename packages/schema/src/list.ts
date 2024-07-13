import {
  array,
  boolean,
  enum_,
  nullable,
  object,
  optional,
  string,
  type InferOutput
} from "valibot"
import { IconType } from "./common"

export enum ListItemTypeEnum {
  "Remote Command" = "Remote Command",
  "Command" = "Command",
  "UI Command" = "UI Command",
  "Inline Command" = "Inline Command",
  "System Command" = "System Command",
  "Application" = "Application",
  "Built-In Command" = "Built-In Command"
}
export const ListItemType = enum_(ListItemTypeEnum)
export type ListItemType = InferOutput<typeof ListItemType>

export const IconSchema = object({
  value: string(),
  type: IconType
})
export type IconSchema = InferOutput<typeof IconSchema>
export const TListItem = object({
  title: string(),
  value: string(),
  description: string(),
  type: ListItemType,
  flags: optional(
    object({
      isDev: optional(boolean(), false),
      isRemovable: optional(boolean(), false)
    }),
    {}
  ),
  icon: nullable(IconSchema),
  keywords: optional(array(string()), []),
  identityFilter: optional(boolean(), false)
})
export type TListItem = InferOutput<typeof TListItem>
export const TListGroup = object({
  title: string(),
  type: string(),
  identifier: string(),
  icon: optional(IconSchema),
  items: array(TListItem),
  flags: object({
    isDev: optional(boolean(), false),
    isRemovable: optional(boolean(), false)
  })
})
export type TListGroup = InferOutput<typeof TListGroup>
// export const TList = array(TListGroup);
// export type TList = infer<typeof TList>;
