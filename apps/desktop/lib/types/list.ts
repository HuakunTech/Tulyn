import { Icon, IconType } from "@kksh/api/models"
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

export enum ListItemTypeEnum {
  RemoteCmd = "Remote Command",
  Command = "Command",
  UICmd = "UI Command",
  InlineCmd = "Template Command",
  SystemCmd = "System Command",
  Application = "Application",
  BuiltInCmd = "Built-In Command"
}
export const ListItemType = enum_(ListItemTypeEnum)
export type ListItemType = InferOutput<typeof ListItemType>

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
  icon: optional(nullable(Icon)),
  keywords: optional(array(string()), []),
  identityFilter: optional(boolean(), false)
})
export type TListItem = InferOutput<typeof TListItem>
export const TListGroup = object({
  title: string(),
  type: string(),
  identifier: string(),
  icon: optional(Icon),
  items: array(TListItem),
  flags: object({
    isDev: optional(boolean(), false),
    isRemovable: optional(boolean(), false)
  })
})
export type TListGroup = InferOutput<typeof TListGroup>
// export const TList = array(TListGroup);
// export type TList = infer<typeof TList>;
