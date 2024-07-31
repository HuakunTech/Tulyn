import { type Remote } from "@huakunshen/comlink"
import {
	BaseDirectory,
	copyFile,
	create,
	exists,
	lstat,
	mkdir,
	readDir,
	readFile,
	readTextFile,
	remove,
	rename,
	stat,
	truncate,
	writeFile,
	writeTextFile
} from "@tauri-apps/plugin-fs"
import { getDefaultClientAPI, isMain } from "tauri-api-adapter"
import { fileSearch } from "../../commands/fileSearch"
import type { IFs } from "../client"
import type { IFsServer } from "../server"

// BaseDirectory.
export function constructAPI(api: Remote<IFsServer>): IFs {
	return {
		readDir: api.fsReadDir,
		readFile: api.fsReadFile,
		readTextFile: api.fsReadTextFile,
		stat: api.fsStat,
		lstat: api.fsLstat,
		exists: api.fsExists,
		mkdir: api.fsMkdir,
		create: api.fsCreate,
		copyFile: api.fsCopyFile,
		remove: api.fsRemove,
		rename: api.fsRename,
		truncate: api.fsTruncate,
		writeFile: api.fsWriteFile,
		writeTextFile: api.fsWriteTextFile,
		fileSearch: api.fsFileSearch
	}
}
const defaultClientAPI = getDefaultClientAPI<IFsServer>()
export const comlinkFs: IFs = constructAPI(defaultClientAPI)

export const nativeFs: IFs = {
	readDir,
	readFile,
	readTextFile,
	stat,
	lstat,
	exists,
	mkdir,
	create,
	copyFile,
	remove,
	rename,
	truncate,
	writeFile,
	writeTextFile,
	fileSearch
}

export const fs = isMain() ? nativeFs : comlinkFs
