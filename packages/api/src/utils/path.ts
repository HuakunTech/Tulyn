import * as pathAPI from "@tauri-apps/api/path"
import { BaseDirectory } from "@tauri-apps/api/path"
import { minimatch } from "minimatch"

export async function combinePathAndBaseDir(target: string, baseDir?: BaseDirectory) {
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

export const mapDirAliasToDirFn: Record<string, () => Promise<string>> = {
	$DESKTOP: pathAPI.desktopDir,
	$DOCUMENT: pathAPI.documentDir,
	$DOWNLOAD: pathAPI.downloadDir,
	$HOME: pathAPI.homeDir,
	$APPDATA: pathAPI.appDataDir
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
 * target should be full path, but this function also does security check to prevent parent directory traversal
 * @param target full path to file
 * @param scope expected to be like $DESKTOP/*, $DOWNLOAD/**
 */
export async function matchPathAndScope(target: string, scope: string): Promise<boolean> {
	const translatedScope = await translateScopeToPath(scope)
	return minimatch(target, translatedScope)
}
