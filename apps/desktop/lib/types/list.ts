import { Icon, IconType } from "@kksh/api/models"
import {
	any,
	array,
	boolean,
	enum_,
	nullable,
	number,
	object,
	optional,
	string,
	union,
	type InferOutput
} from "valibot"

export enum ListItemTypeEnum {
	RemoteCmd = "Remote Command",
	Command = "Command",
	UICmd = "UI Command",
	InlineCmd = "Template Command",
	SystemCmd = "System Command",
	Application = "Application",
	BuiltInCmd = "Built-In Command",
	QuickLink = "Quick Link"
}
export const ListItemType = enum_(ListItemTypeEnum)
export type ListItemType = InferOutput<typeof ListItemType>

export const ExtCmdListItemValue = object({
	extIdentifier: string(), // extension identifer is enough to find an extenion in DB or on disk
	cmdName: string(),
	cmdId: number(), // cmdId is enough to find a command in DB
	flags: optional(
		object({
			isDev: boolean(),
			isRemovable: boolean()
		})
	),
	data: union([string(), any()])
})
export type ExtCmdListItemValue = InferOutput<typeof ExtCmdListItemValue>

/**
 * A command item can be a extension command or some custom stuff, so it shouldn't contain
 * extension-sepcific data in the root level.
 * Extension-specific data can be stored in a separate field
 */
export const CmdListItemValue = object({
	type: ListItemType,
	data: union([string(), ExtCmdListItemValue])
})

export type CmdListItemValue = InferOutput<typeof CmdListItemValue>
export const TListItem = object({
	title: string(),
	value: CmdListItemValue,
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
