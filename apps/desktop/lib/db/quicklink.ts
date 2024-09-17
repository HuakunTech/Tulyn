import { KUNKUN_EXT_IDENTIFIER } from "@kksh/api"
import { db } from "@kksh/api/commands"
import { CmdType, CmdTypeEnum } from "@kksh/api/models"

// export function getQuickLinkExtension() {
// 	return db.getExtensionByIdentifier(KUNKUN_EXT_IDENTIFIER.KUNKUN_QUICK_LINKS_EXT_IDENTIFIER)
// }

export async function createQuickLinkCommand(name: string, link: string) {
	const extension = await db.getExtQuickLinks()
	return db.createCommand({
		extId: extension.extId,
		name,
		cmdType: CmdTypeEnum.QuickLink,
		data: link,
		enabled: true
	})
}

export async function getAllQuickLinkCommands() {
	const extension = await db.getExtQuickLinks()
	const cmds = await db.getCommandsByExtId(extension.extId)
	return cmds
}
