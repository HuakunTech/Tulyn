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
import { Color } from "../../models/color"
import { NodeName, NodeNameEnum } from "../../models/constants"
import { Icon } from "../../models/icon"

/* -------------------------------------------------------------------------- */
/*                                 Empty View                                 */
/* -------------------------------------------------------------------------- */
export const EmptyView = object({
  nodeName: NodeName,
  title: optional(string()),
  description: optional(string()),
  icon: optional(Icon)
})
export type EmptyView = InferOutput<typeof EmptyView>

/* -------------------------------------------------------------------------- */
/*                                  Dropdown                                  */
/* -------------------------------------------------------------------------- */
export const DropdownItem = object({
  nodeName: NodeName,
  title: string(),
  value: string(),
  icon: optional(Icon),
  keywords: optional(array(string()))
})
export const DropdownSection = object({
  nodeName: NodeName,
  title: string(),
  items: array(DropdownItem)
})
export const Dropdown = object({
  nodeName: NodeName,
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
  nodeName: NodeName,
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
  nodeName: NodeName,
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
  nodeName: NodeName,
  title: string(),
  text: string(),
  url: string()
})
export type ItemDetailMetadataLink = InferOutput<typeof ItemDetailMetadataLink>

export const ItemDetailMetadataTagListItem = object({
  nodeName: NodeName,
  text: optional(string()),
  color: optional(Color),
  icon: optional(Icon)
})
export type ItemDetailMetadataTagListItem = InferOutput<typeof ItemDetailMetadataTagListItem>

export const ItemDetailMetadataTagList = object({
  nodeName: NodeName,
  title: string(),
  tags: array(ItemDetailMetadataTagListItem)
})
export type ItemDetailMetadataTagList = InferOutput<typeof ItemDetailMetadataTagList>

export const ItemDetailMetadataSeparator = object({
  nodeName: NodeName
})
export type ItemDetailMetadataSeparator = InferOutput<typeof ItemDetailMetadataSeparator>

export const ItemDetailMetadata = object({
  nodeName: NodeName,
  items: array(
    union([
      ItemDetailMetadataLabel,
      ItemDetailMetadataLink,
      ItemDetailMetadataTagList,
      ItemDetailMetadataSeparator
    ])
  )
})
export type ItemDetailMetadata = InferOutput<typeof ItemDetailMetadata>

export const ItemDetail = object({
  nodeName: NodeName,
  markdown: optional(string()),
  metadata: optional(ItemDetailMetadata)
})
export type ItemDetail = InferOutput<typeof ItemDetail>

export const Item = object({
  nodeName: NodeName,
  title: string(),
  subTitle: optional(string()),
  accessories: optional(array(ItemAccessory)),
  // actions:
  detail: optional(ItemDetail),
  icon: optional(Icon),
  keywords: optional(array(string()))
  // id: optional(string('')),
})
export type Item = InferOutput<typeof Item>

export const Section = object({
  nodeName: NodeName,
  title: optional(string()),
  subtitle: optional(string()),
  items: array(Item)
})
export type Section = InferOutput<typeof Section>

export const List = object({
  nodeName: NodeName,
  sections: optional(array(Section)),
  items: optional(array(Item))
})
export type List = InferOutput<typeof List>
