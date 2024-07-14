import {
  array,
  boolean,
  date,
  enum_,
  hexColor,
  literal,
  nullable,
  object,
  optional,
  pipe,
  string,
  union,
  type InferOutput
} from "valibot"

export enum NodeNameEnum {
  ListView = "ListView",
  ListItem = "ListItem",
  ListItemAccessory = "ListItemAccessory",
  ListSection = "ListSection",
  ListItemDetailMetadataLabel = "ListItemDetailMetadataLabel",
  ListItemDetailMetadataLink = "ListItemDetailMetadataLink",
  ListItemDetailMetadataTagList = "ListItemDetailMetadataTagList",
  ListItemDetailMetadataTagListItem = "ListItemDetailMetadataTagListItem",
  ListItemDetailMetadataSeparator = "ListItemDetailMetadataSeparator",
  Icon = "Icon",
  EmptyView = "EmptyView",
  Dropdown = "Dropdown",
  DropdownSection = "DropdownSection",
  DropdownItem = "DropdownItem"
}
export const NodeName = enum_(NodeNameEnum)

/* -------------------------------------------------------------------------- */
/*                                    Style                                   */
/* -------------------------------------------------------------------------- */
export const Color = pipe(string(), hexColor())

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

/* -------------------------------------------------------------------------- */
/*                                 Empty View                                 */
/* -------------------------------------------------------------------------- */
export const EmptyView = object({
  nodeName: literal(NodeNameEnum.EmptyView),
  title: string(),
  description: string(),
  icon: optional(Icon)
})
export type EmptyView = InferOutput<typeof EmptyView>

/* -------------------------------------------------------------------------- */
/*                                  Dropdown                                  */
/* -------------------------------------------------------------------------- */
export const DropdownItem = object({
  nodeName: literal(NodeNameEnum.DropdownItem),
  title: string(),
  value: string(),
  icon: optional(Icon),
  keywords: optional(array(string()))
})
export const DropdownSection = object({
  nodeName: literal(NodeNameEnum.DropdownSection),
  title: string(),
  items: array(DropdownItem)
})
export const Dropdown = object({
  nodeName: literal(NodeNameEnum.Dropdown),
  tooltip: string(),
  sections: array(DropdownSection),
  defaultValue: string()
})
export type DropdownItem = InferOutput<typeof DropdownItem>
export type DropdownSection = InferOutput<typeof DropdownSection>
export type Dropdown = InferOutput<typeof Dropdown>

/* -------------------------------------------------------------------------- */
/*                                    List                                    */
/* -------------------------------------------------------------------------- */
export const ItemAccessory = object({
  nodeName: literal(NodeNameEnum.ListItemAccessory),
  tag: optional(
    union([
      string(),
      object({
        color: Color,
        text: string()
      })
    ])
  ),
  text: optional(union([string(), object({ color: Color, text: string() })])),
  date: optional(union([date(), object({ color: Color, text: date() })])),
  icon: optional(Icon),
  tooltip: optional(string())
})
export type ItemAccessory = InferOutput<typeof ItemAccessory>

export const ItemDetailMetadataLabel = object({
  nodeName: literal(NodeNameEnum.ListItemDetailMetadataLabel),
  title: string(),
  icon: optional(Icon),
  text: optional(
    union([
      string(),
      object({
        color: Color,
        text: string()
      })
    ])
  )
})
export type ItemDetailMetadataLabel = InferOutput<typeof ItemDetailMetadataLabel>

export const ItemDetailMetadataLink = object({
  nodeName: literal(NodeNameEnum.ListItemDetailMetadataLink),
  title: string(),
  text: string(),
  url: string()
})
export type ItemDetailMetadataLink = InferOutput<typeof ItemDetailMetadataLink>

export const ItemDetailMetadataTagListItem = object({
  nodeName: literal(NodeNameEnum.ListItemDetailMetadataTagListItem),
  text: optional(string()),
  color: optional(Color),
  icon: optional(Icon)
})
export type ItemDetailMetadataTagListItem = InferOutput<typeof ItemDetailMetadataTagListItem>

export const ItemDetailMetadataTagList = object({
  nodeName: literal(NodeNameEnum.ListItemDetailMetadataTagList),
  title: string(),
  tags: array(ItemDetailMetadataTagListItem)
})
export type ItemDetailMetadataTagList = InferOutput<typeof ItemDetailMetadataTagList>

export const ItemDetailMetadataSeparator = object({
  nodeName: literal(NodeNameEnum.ListItemDetailMetadataSeparator)
})
export type ItemDetailMetadataSeparator = InferOutput<typeof ItemDetailMetadataSeparator>

export const ItemDetail = object({
  markdown: optional(string()),
  metadata: optional(
    array(
      union([
        ItemDetailMetadataLabel,
        ItemDetailMetadataLink,
        ItemDetailMetadataTagListItem,
        ItemDetailMetadataTagList,
        ItemDetailMetadataSeparator
      ])
    )
  )
})
export type ItemDetail = InferOutput<typeof ItemDetail>

export const ListItem = object({
  nodeName: literal(NodeNameEnum.ListItem),
  title: string(),
  subtitle: optional(string()),
  accessories: array(ItemAccessory),
  // actions:
  detail: optional(ItemDetail),
  icon: optional(Icon),
  keywords: optional(array(string())),
  id: string(),
  shortcut: optional(string())
})
export type ListItem = InferOutput<typeof ListItem>

export const ListSection = object({
  nodeName: literal(NodeNameEnum.ListSection),
  title: optional(string()),
  subtitle: optional(string()),
  items: array(ListItem)
})
export type ListSection = InferOutput<typeof ListSection>
