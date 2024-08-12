import type { IFs } from "../client"

export interface IFsServer {
	fsReadDir: IFs["readDir"]
	fsReadFile: IFs["readFile"]
	fsReadTextFile: IFs["readTextFile"]
	fsStat: IFs["stat"]
	fsLstat: IFs["lstat"]
	fsExists: IFs["exists"]
	fsMkdir: IFs["mkdir"]
	fsCreate: IFs["create"]
	fsCopyFile: IFs["copyFile"]
	fsRemove: IFs["remove"]
	fsRename: IFs["rename"]
	fsTruncate: IFs["truncate"]
	fsWriteFile: IFs["writeFile"]
	fsWriteTextFile: IFs["writeTextFile"]
	fsFileSearch: IFs["fileSearch"]
}
