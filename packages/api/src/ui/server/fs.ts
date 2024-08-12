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
import { fileSearch, FileSearchParams } from "../../commands/fileSearch"
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
	$DOWNLOAD: pathAPI.downloadDir,
	$HOME: pathAPI.homeDir,
	$APPDATA: pathAPI.appDataDir
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
		case BaseDirectory.Home:
			return await pathAPI.join(await pathAPI.homeDir(), target)
		case BaseDirectory.AppData:
			return await pathAPI.join(await pathAPI.appDataDir(), target)
		default:
			break
	}
}

/**
 * @example
 * Translate $DESKTOP/* to /Users/username/Desktop/*
 * Translate $DOWNLOAD/** to /Users/username/Downloads/**
 * @param scope expected to be like $DESKTOP/*, $DOWNLOAD/**, $DOCUMENT/abc/*.txt
 */
export async function translateScopeToPath(scope: string): Promise<string> {
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
	return minimatch(target, translatedScope)
}

export const fsRequiredPermissionMap: Record<keyof IFsServer, KunkunFsPermission[]> = {
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
	// console.log("verifyPermission", requiredPermissions, userPermissionScopes, path, options)
	const fullPath = await combinePathAndBaseDir(path, options?.baseDir)
	if (!fullPath) {
		throw new Error("Invalid path or base directory")
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
			if (!deny.path) continue
			if (await matchPathAndScope(fullPath, deny.path)) {
				throw new Error(`Permission denied for path: ${fullPath} by rule ${deny.path}`)
			}
		}
		for (const allow of permission.allow || []) {
			if (!allow.path) continue
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
		fsReadDir: createMethod(fsRequiredPermissionMap.fsReadDir, fsReadDir),
		fsReadFile: createMethod(fsRequiredPermissionMap.fsReadFile, fsReadFile),
		fsReadTextFile: createMethod(fsRequiredPermissionMap.fsReadTextFile, fsReadTextFile),
		fsStat: createMethod(fsRequiredPermissionMap.fsStat, fsStat),
		fsLstat: createMethod(fsRequiredPermissionMap.fsLstat, fsLstat),
		fsExists: createMethod(fsRequiredPermissionMap.fsExists, fsExists),
		fsMkdir: createMethod(fsRequiredPermissionMap.fsMkdir, fsMkdir),
		fsCreate: createMethod(fsRequiredPermissionMap.fsCreate, fsCreate),
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
		fsRemove: createMethod(fsRequiredPermissionMap.fsRemove, fsRemove),
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
			verifyPermission(fsRequiredPermissionMap.fsTruncate, permissions, path, options).then(() =>
				fsTruncate(path, len, options)
			),
		fsWriteFile: (path: string | URL, data: Uint8Array, options?: WriteFileOptions) =>
			verifyPermission(fsRequiredPermissionMap.fsTruncate, permissions, path, options).then(() =>
				fsWriteFile(path, data, options)
			),
		fsWriteTextFile: (path: string | URL, data: string, options?: WriteFileOptions) =>
			verifyPermission(fsRequiredPermissionMap.fsTruncate, permissions, path, options).then(() =>
				fsWriteTextFile(path, data, options)
			),
		fsFileSearch: (
			searchParams: FileSearchParams & {
				hidden?: boolean
				ignore_case?: boolean
			}
		) => {
			return Promise.all(
				// TODO: first verify all search locations are allowed, for now, recursive search is allowed even if scope allows one level only
				searchParams.locations.map((loc) =>
					verifyPermission(fsRequiredPermissionMap.fsFileSearch, permissions, loc)
				)
			).then(() => fileSearch(searchParams))
		}
	}
}
