import { Ext, ExtCmd } from "@kksh/api/models"
import { CmdListItemValue, ListItemType, ListItemTypeEnum, type TListItem } from "~/lib/types/list"
import { boolean, number, object, string, type InferOutput } from "valibot"

// export function generateCmdListItemValue(
// 	ext: Ext,
// 	cmd: ExtCmd,
// 	flags: { isDev: boolean; isRemovable: boolean }
// ): CmdListItemValue {
// 	return {
// 		extIdentifier: ext.identifier,
// 		cmdName: cmd.name,
// 		cmdId: cmd.cmdId,
// 		data: cmd.data,
// 		flags
// 	}
// }

/**
 * Convert Command from database to TListItem to display in CmdPalette
 * @param cmd
 * @returns
 */
// export function dbCmdToTListItem(
// 	ext: Ext,
// 	cmd: ExtCmd,
// 	flags: { isDev: boolean; isRemovable: boolean },
// 	keywordsGenerator: (ext: Ext, cmd: ExtCmd) => string[],
// 	type: ListItemType
// ): TListItem {
// 	return {
// 		title: cmd.name,
// 		value: generateCmdListItemValue(ext, cmd, flags),
// 		description: "",
// 		type,
// 		identityFilter: true,
// 		keywords: keywordsGenerator(ext, cmd),
// 		flags
// 	}
// }
