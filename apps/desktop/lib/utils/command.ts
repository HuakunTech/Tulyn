import type { ExtCmd } from "@kksh/api/models"
import { ListItemType, ListItemTypeEnum, type TListItem } from "~/lib/types/list"

/**
 * Convert Command from database to TListItem to display in CmdPalette
 * @param cmd 
 * @returns 
 */
export function dbCmdToTListItem(cmd: ExtCmd): TListItem {
	return {
		title: cmd.name,
		value: cmd.cmdId.toString(),
		description: "",
		type: ListItemType.enum.QuickLink,
		identityFilter: true,
		keywords: ["quicklink"],
		flags: { isDev: false, isRemovable: false }
	}
}
