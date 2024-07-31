import * as pathAPI from "@tauri-apps/api/path"
import { BaseDirectory } from "@tauri-apps/api/path"
import {
	copyFile as fsCopyFile,
	create as fsCreate,
	exists as fsExists,
	lstat as fsLstat,
	mkdir as fsMkdir,
	readDir as fsReadDir,
	readFile as fsReadFile,
	readTextFile as fsReadTextFile,
	remove as fsRemove,
	rename as fsRename,
	stat as fsStat,
	truncate as fsTruncate,
	writeFile as fsWriteFile,
	writeTextFile as fsWriteTextFile,
	type CopyFileOptions,
	type CreateOptions,
	type ExistsOptions,
	type MkdirOptions,
	type ReadDirOptions,
	type ReadFileOptions,
	type RemoveOptions,
	type RenameOptions,
	type StatOptions,
	type TruncateOptions,
	type WriteFileOptions
} from "@tauri-apps/plugin-fs"
import { minimatch } from "minimatch"
import { fileSearch } from "../../commands/fileSearch"
import {
	AllKunkunPermission,
	type FsPermissionScoped,
	type KunkunFsPermission,
	type SystemPermission
} from "../api/permissions"
import type { IDb, IFs, ISystem, IToast, IUiIframe, IUiWorker } from "../client"

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

export const mapDirAliasToDirFn: Record<string, () => Promise<string>> = {
	$DESKTOP: pathAPI.desktopDir,
	$DOCUMENT: pathAPI.documentDir,
	$DOWNLOAD: pathAPI.downloadDir
}

const samplePermission: FsPermissionScoped = {
	permission: "fs:read",
	allow: [{ path: "$DESKTOP/*" }],
	deny: []
}

/**
 * @example
 * Translate $DESKTOP/* to /Users/username/Desktop/*
 * Translate $DOWNLOAD/** to /Users/username/Downloads/**
 * @param scope expected to be like $DESKTOP/*, $DOWNLOAD/**, $DOCUMENT/abc/*.txt
 */
export async function translateScopeToPath(scope: string): Promise<string> {
	// find the first slash of scope, split it into alias and pattern
	// const slashIndex = scope.indexOf("/")
	// if (slashIndex === -1) {
	// 	throw new Error(`Invalid scope: ${scope}`)
	// }
	// const validAlias = Object.keys(mapDirAliasToDirFn)
	// 	.map((key) => scope.startsWith(key))
	// 	.some((x) => x)
	for (const key of Object.keys(mapDirAliasToDirFn)) {
		if (scope.startsWith(key)) {
			const alias = key
			const pattern = scope.slice(key.length)
			const dirFn = mapDirAliasToDirFn[alias]
			if (!dirFn) {
				throw new Error(`Invalid scope alias: ${alias}`)
			}
			const fullDir = await dirFn()
			return pathAPI.join(fullDir, pattern)
		}
	}
	throw new Error(`Invalid scope: ${scope}`)
}

/**
 * path should be full path, but this function also does security check to prevent parent directory traversal
 * @param path full path to file
 * @param scope expected to be like $DESKTOP/*, $DOWNLOAD/**
 */
async function matchPathAndScope(target: string, scope: string): Promise<boolean> {
	const translatedScope = await translateScopeToPath(scope)
	console.log("matchPathAndScope", target, translatedScope, minimatch(target, translatedScope))
	return minimatch(target, translatedScope)
}

async function combinePathAndBaseDir(target: string, baseDir?: BaseDirectory) {
	if (!baseDir) return target
	switch (baseDir) {
		case BaseDirectory.Desktop:
			return await pathAPI.join(await pathAPI.desktopDir(), target)
		case BaseDirectory.Document:
			return await pathAPI.join(await pathAPI.documentDir(), target)
		case BaseDirectory.Download:
			return await pathAPI.join(await pathAPI.downloadDir(), target)
		default:
			break
	}
}

const requiredPermissionMap: Record<keyof IFsServer, KunkunFsPermission[]> = {
	fsReadDir: ["fs:read", "fs:read-dir"],
	fsReadFile: ["fs:read"],
	fsReadTextFile: ["fs:read"],
	fsStat: ["fs:stat", "fs:read"],
	fsLstat: ["fs:stat", "fs:read"],
	fsExists: ["fs:exists", "fs:read"],
	fsMkdir: ["fs:write"],
	fsCreate: ["fs:write"],
	fsCopyFile: ["fs:write"],
	fsRemove: ["fs:write"],
	fsRename: ["fs:write"],
	fsTruncate: ["fs:write"],
	fsWriteFile: ["fs:write"],
	fsWriteTextFile: ["fs:write"],
	fsFileSearch: ["fs:search"]
}

async function verifyPermission(
	requiredPermissions: KunkunFsPermission[],
	userPermissionScopes: FsPermissionScoped[],
	path: string | URL,
	options?: { baseDir?: BaseDirectory }
) {
	path = path.toString()
	const fullPath = await combinePathAndBaseDir(path, options?.baseDir)

	if (!fullPath) {
		throw new Error("Invalid path")
	}

	const matchedPermissionScope = userPermissionScopes.filter((p) =>
		requiredPermissions.includes(p.permission)
	)
	if (matchedPermissionScope.length === 0) {
		throw new Error(
			`FS Permission denied. Require one of these: [${requiredPermissions.join(", ")}] for path: ${fullPath}`
		)
	}

	for (const permission of matchedPermissionScope) {
		// deny has priority, if deny rule is matched, we ignore allow rule
		for (const deny of permission.deny || []) {
			if (await matchPathAndScope(fullPath, deny.path)) {
				throw new Error(`Permission denied for path: ${fullPath} by rule ${deny.path}`)
			}
		}
		for (const allow of permission.allow || []) {
			if (await matchPathAndScope(fullPath, allow.path)) {
				return
			}
		}
	}
	// No Allow rule and path matched
	throw new Error(`Permission denied for path: ${path}, no rule matched.`)
}

export function constructFsApi(permissions: FsPermissionScoped[]): IFsServer {
	/**
	 * This is a helper function to simplify the creation of methods that takes one path and one options object
	 * @param requiredPermissions
	 * @param fn
	 * @returns
	 */
	const createMethod = <T extends (...args: any[]) => Promise<any>>(
		requiredPermissions: KunkunFsPermission[],
		fn: T
	) => {
		return (path: string | URL, options?: { baseDir?: BaseDirectory }): ReturnType<T> =>
			verifyPermission(requiredPermissions, permissions, path, options).then((result) =>
				fn(path, options)
			) as ReturnType<T>
	}
	return {
		fsReadDir: createMethod(requiredPermissionMap.fsReadDir, fsReadDir),
		fsReadFile: createMethod(requiredPermissionMap.fsReadFile, fsReadFile),
		fsReadTextFile: createMethod(requiredPermissionMap.fsReadTextFile, fsReadTextFile),
		fsStat: createMethod(requiredPermissionMap.fsStat, fsStat),
		fsLstat: createMethod(requiredPermissionMap.fsLstat, fsLstat),
		fsExists: createMethod(requiredPermissionMap.fsExists, fsExists),
		fsMkdir: createMethod(requiredPermissionMap.fsMkdir, fsMkdir),
		fsCreate: createMethod(requiredPermissionMap.fsCreate, fsCreate),
		fsCopyFile: (fromPath: string | URL, toPath: string | URL, options?: CopyFileOptions) => {
			return fsStat(fromPath)
				.then((oldPathStat) => {
					const oldPathPermissions: KunkunFsPermission[] = ["fs:read"]
					if (oldPathStat.isDirectory) {
						oldPathPermissions.push("fs:read-dir")
					}
					return Promise.all([
						verifyPermission(oldPathPermissions, permissions, fromPath, {
							baseDir: options?.fromPathBaseDir
						}),
						verifyPermission(["fs:write"], permissions, toPath, {
							baseDir: options?.toPathBaseDir
						})
					])
				})
				.then(() => fsCopyFile(fromPath, toPath, options))
		},
		fsRemove: createMethod(requiredPermissionMap.fsRemove, fsRemove),
		fsRename: async (oldPath: string | URL, newPath: string | URL, options?: RenameOptions) => {
			return fsStat(oldPath)
				.then((oldPathStat) => {
					const oldPathPermissions: KunkunFsPermission[] = ["fs:read"]
					if (oldPathStat.isDirectory) {
						oldPathPermissions.push("fs:read-dir")
					}
					return Promise.all([
						verifyPermission(oldPathPermissions, permissions, oldPath, {
							baseDir: options?.oldPathBaseDir
						}),
						verifyPermission(["fs:write"], permissions, newPath, {
							baseDir: options?.oldPathBaseDir
						})
					])
				})
				.then(() => fsRename(oldPath, newPath, options))
		},
		fsTruncate: (path: string | URL, len?: number, options?: TruncateOptions) =>
			verifyPermission(requiredPermissionMap.fsTruncate, permissions, path, options).then(() =>
				fsTruncate(path, len, options)
			),
		fsWriteFile: (path: string | URL, data: Uint8Array, options?: WriteFileOptions) =>
			verifyPermission(requiredPermissionMap.fsTruncate, permissions, path, options).then(() =>
				fsWriteFile(path, data, options)
			),
		fsWriteTextFile: (path: string | URL, data: string, options?: WriteFileOptions) =>
			verifyPermission(requiredPermissionMap.fsTruncate, permissions, path, options).then(() =>
				fsWriteTextFile(path, data, options)
			),
		fsFileSearch: fileSearch
	}
}
