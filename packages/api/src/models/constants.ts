import { enum_, type InferOutput } from "valibot"

export enum NodeNameEnum {
  List = "List",
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
export type NodeName = InferOutput<typeof NodeName>
