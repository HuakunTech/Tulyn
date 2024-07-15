import type { Color } from "../../../models/color"
import { NodeName, NodeNameEnum } from "../../../models/constants"
import * as ListSchema from "../schema/list"
import { Icon } from "./icon"
import { type IComponent } from "./interfaces"

type OmitNodeName<T> = Omit<T, "nodeName">
type ReplaceIcon<T> = T & { icon?: Icon }
type IconConstructorPatch<T> = ReplaceIcon<OmitNodeName<T>>

export class EmptyView implements ListSchema.EmptyView, IComponent<ListSchema.EmptyView> {
  nodeName: NodeName = NodeNameEnum.EmptyView
  title?: string
  description?: string
  icon?: Icon

  constructor(model: IconConstructorPatch<ListSchema.EmptyView>) {
    this.title = model.title
    this.description = model.description
    this.icon = model.icon
  }

  toModel(): ListSchema.EmptyView {
    return {
      nodeName: this.nodeName,
      title: this.title,
      description: this.description,
      icon: this.icon?.toModel()
    }
  }
}

export class DropdownItem implements ListSchema.DropdownItem, IComponent<ListSchema.DropdownItem> {
  nodeName: NodeName = NodeNameEnum.DropdownItem
  title: string
  value: string
  icon?: Icon
  keywords?: string[]

  constructor(model: IconConstructorPatch<ListSchema.DropdownItem>) {
    this.title = model.title
    this.value = model.value
    this.icon = model.icon
    this.keywords = model.keywords
  }

  toModel(): ListSchema.DropdownItem {
    return {
      nodeName: this.nodeName,
      title: this.title,
      value: this.value,
      icon: this.icon?.toModel(),
      keywords: this.keywords
    }
  }
}

export class DropdownSection
  implements ListSchema.DropdownSection, IComponent<ListSchema.DropdownSection>
{
  nodeName: NodeName = NodeNameEnum.DropdownSection
  title: string
  items: DropdownItem[]

  constructor(model: OmitNodeName<ListSchema.DropdownSection> & { items: DropdownItem[] }) {
    this.title = model.title
    this.items = model.items
  }

  toModel(): ListSchema.DropdownSection {
    return {
      nodeName: this.nodeName,
      title: this.title,
      items: this.items.map((item) => item.toModel())
    }
  }
}

export class Dropdown implements ListSchema.Dropdown, IComponent<ListSchema.Dropdown> {
  nodeName: NodeName = NodeNameEnum.Dropdown
  tooltip: string
  sections: DropdownSection[]
  defaultValue: string

  constructor(model: IconConstructorPatch<ListSchema.Dropdown> & { sections: DropdownSection[] }) {
    this.tooltip = model.tooltip
    this.sections = model.sections
    this.defaultValue = model.defaultValue
  }

  toModel(): ListSchema.Dropdown {
    return {
      nodeName: this.nodeName,
      tooltip: this.tooltip,
      sections: this.sections.map((section) => section.toModel()),
      defaultValue: this.defaultValue
    }
  }
}

export class ItemAccessory
  implements ListSchema.ItemAccessory, IComponent<ListSchema.ItemAccessory>
{
  nodeName: NodeName = NodeNameEnum.ListItemAccessory
  tag?: string | { color: Color; text: string }
  text?: string | { color: Color; text: string }
  date?: Date | { color: Color; text: Date }
  icon?: Icon
  tooltip?: string

  constructor(model: IconConstructorPatch<ListSchema.ItemAccessory>) {
    this.tag = model.tag
    this.text = model.text
    this.date = model.date
    this.icon = model.icon
    this.tooltip = model.tooltip
  }

  toModel(): ListSchema.ItemAccessory {
    return {
      nodeName: this.nodeName,
      tag: this.tag,
      text: this.text,
      date: this.date,
      icon: this.icon?.toModel(),
      tooltip: this.tooltip
    }
  }
}

export class ItemDetailMetadataLabel
  implements ListSchema.ItemDetailMetadataLabel, IComponent<ListSchema.ItemDetailMetadataLabel>
{
  nodeName: NodeName = NodeNameEnum.ListItemDetailMetadataLabel
  title: string
  icon?: Icon
  text?: string | { color: Color; text: string }

  constructor(model: IconConstructorPatch<ListSchema.ItemDetailMetadataLabel>) {
    this.title = model.title
    this.icon = model.icon
    this.text = model.text
  }

  toModel(): ListSchema.ItemDetailMetadataLabel {
    return {
      nodeName: this.nodeName,
      title: this.title,
      icon: this.icon?.toModel(),
      text: this.text
    }
  }
}

export class ItemDetailMetadataLink
  implements ListSchema.ItemDetailMetadataLink, IComponent<ListSchema.ItemDetailMetadataLink>
{
  nodeName: NodeName = NodeNameEnum.ListItemDetailMetadataLink
  title: string
  text: string
  url: string

  constructor(model: OmitNodeName<ListSchema.ItemDetailMetadataLink>) {
    this.title = model.title
    this.text = model.text
    this.url = model.url
  }

  toModel(): ListSchema.ItemDetailMetadataLink {
    return {
      nodeName: this.nodeName,
      title: this.title,
      text: this.text,
      url: this.url
    }
  }
}

export class ItemDetailMetadataTagListItem
  implements
    ListSchema.ItemDetailMetadataTagListItem,
    IComponent<ListSchema.ItemDetailMetadataTagListItem>
{
  nodeName: NodeName = NodeNameEnum.ListItemDetailMetadataTagListItem
  text?: string
  color?: Color
  icon?: Icon

  constructor(model: IconConstructorPatch<ListSchema.ItemDetailMetadataTagListItem>) {
    this.text = model.text
    this.color = model.color
    this.icon = model.icon
  }

  toModel(): ListSchema.ItemDetailMetadataTagListItem {
    return {
      nodeName: this.nodeName,
      text: this.text,
      color: this.color,
      icon: this.icon?.toModel()
    }
  }
}

export class ItemDetailMetadataTagList
  implements ListSchema.ItemDetailMetadataTagList, IComponent<ListSchema.ItemDetailMetadataTagList>
{
  nodeName: NodeName = NodeNameEnum.ListItemDetailMetadataTagList
  title: string
  tags: ItemDetailMetadataTagListItem[]

  constructor(
    model: OmitNodeName<ListSchema.ItemDetailMetadataTagList> & {
      tags: ItemDetailMetadataTagListItem[]
    }
  ) {
    this.title = model.title
    this.tags = model.tags
  }

  toModel(): ListSchema.ItemDetailMetadataTagList {
    return {
      nodeName: this.nodeName,
      title: this.title,
      tags: this.tags.map((tag) => tag.toModel())
    }
  }
}

export class ItemDetailMetadataSeparator
  implements
    ListSchema.ItemDetailMetadataSeparator,
    IComponent<ListSchema.ItemDetailMetadataSeparator>
{
  nodeName: NodeName = NodeNameEnum.ListItemDetailMetadataSeparator

  toModel(): ListSchema.ItemDetailMetadataSeparator {
    return {
      nodeName: this.nodeName
    }
  }
}

export class ItemDetailMetadata
  implements ListSchema.ItemDetailMetadata, IComponent<ListSchema.ItemDetailMetadata>
{
  nodeName: NodeName = NodeNameEnum.ListItemDetailMetadata
  items: (
    | ItemDetailMetadataLabel
    | ItemDetailMetadataLink
    | ItemDetailMetadataTagListItem
    | ItemDetailMetadataTagList
    | ItemDetailMetadataSeparator
  )[]

  constructor(
    items: (
      | ItemDetailMetadataLabel
      | ItemDetailMetadataLink
      | ItemDetailMetadataTagListItem
      | ItemDetailMetadataTagList
      | ItemDetailMetadataSeparator
    )[]
  ) {
    this.items = items
  }

  toModel(): ListSchema.ItemDetailMetadata {
    return {
      nodeName: this.nodeName,
      items: this.items.map((item) => item.toModel())
    }
  }
}

export class ItemDetail implements ListSchema.ItemDetail, IComponent<ListSchema.ItemDetail> {
  nodeName: NodeName = NodeNameEnum.ListItemDetail
  markdown?: string
  metadata?: ItemDetailMetadata

  constructor(model: OmitNodeName<ListSchema.ItemDetail & { metadata: ItemDetailMetadata }>) {
    this.markdown = model.markdown
    this.metadata = model.metadata
  }

  toModel(): ListSchema.ItemDetail {
    return {
      nodeName: this.nodeName,
      metadata: this.metadata?.toModel()
    }
  }
}

export class Item implements ListSchema.Item, IComponent<ListSchema.Item> {
  nodeName: NodeName = NodeNameEnum.ListItem
  title: string
  subTitle?: string
  accessories?: ItemAccessory[]
  detail?: ItemDetail
  icon?: Icon
  keywords?: string[]

  constructor(
    model: OmitNodeName<ListSchema.Item> & {
      accessories?: ItemAccessory[]
      detail?: ItemDetail
      icon?: Icon
    }
  ) {
    this.title = model.title
    this.subTitle = model.subTitle
    this.accessories = model.accessories
    this.detail = model.detail
    this.icon = model.icon
    this.keywords = model.keywords
  }

  toModel(): ListSchema.Item {
    return {
      nodeName: this.nodeName,
      title: this.title,
      subTitle: this.subTitle,
      accessories: this.accessories?.map((accessory) => accessory.toModel()),
      detail: this.detail?.toModel(),
      icon: this.icon?.toModel(),
      keywords: this.keywords
    }
  }
}

export class Section implements ListSchema.Section, IComponent<ListSchema.Section> {
  nodeName: NodeName = NodeNameEnum.ListSection
  title?: string
  subtitle?: string
  items: Item[]

  constructor(model: OmitNodeName<ListSchema.Section> & { items: Item[] }) {
    this.title = model.title
    this.subtitle = model.subtitle
    this.items = model.items
  }

  toModel(): ListSchema.Section {
    return {
      nodeName: this.nodeName,
      title: this.title,
      subtitle: this.subtitle,
      items: this.items.map((item) => item.toModel())
    }
  }
}

export class List implements ListSchema.List, IComponent<ListSchema.List> {
  nodeName: NodeName = NodeNameEnum.List
  sections?: Section[]
  items?: Item[]

  constructor(model: OmitNodeName<ListSchema.List> & { sections?: Section[]; items?: Item[] }) {
    this.sections = model.sections
    this.items = model.items
  }

  toModel(): ListSchema.List {
    return {
      nodeName: this.nodeName,
      sections: this.sections?.map((section) => section.toModel()),
      items: this.items?.map((item) => item.toModel())
    }
  }
}
