import { enum_ } from "valibot"

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
