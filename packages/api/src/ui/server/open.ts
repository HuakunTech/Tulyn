import { exists, stat } from "@tauri-apps/plugin-fs"
import { minimatch } from "minimatch"
import { open } from "tauri-plugin-shellx-api"
import { flatten, parse, pipe, safeParse, string, url, type InferOutput } from "valibot"
import type { OpenPermissionScoped } from "../../permissions"
import type { IOpen } from "../client"

const UrlSchema = pipe(string("A URL must be string."), url("The URL is badly formatted."))

export interface IOpenServer {
	openUrl: IOpen["openUrl"]
	openFile: IOpen["openFile"]
	openFolder: IOpen["openFolder"]
}

function checkPermission(
	permissions: OpenPermissionScoped[],
	value: string,
	key: "url" | "path"
): boolean {
	let pass = false
	for (const permission of permissions) {
		for (const allow of permission.allow || []) {
			if (allow[key] && minimatch(value, allow[key])) {
				pass = true
				break
			}
		}
		if (pass) {
			break
		}
		for (const deny of permission.deny || []) {
			if (deny[key] && minimatch(value, deny[key])) {
				pass = false
				break
			}
		}
	}
	return pass
}

export function constructOpenApi(permissions: OpenPermissionScoped[]): IOpenServer {
	return {
		openUrl: async (url: string) => {
			const parseResult = safeParse(UrlSchema, url)
			if (parseResult.success) {
			} else {
				console.error(flatten<typeof UrlSchema>(parseResult.issues))
				throw new Error(`URL is Invalid: ${url}`)
			}
			// permission check
			if (
				checkPermission(
					permissions.filter((p) => p.permission === "open:url"),
					parseResult.output,
					"url"
				)
			) {
				open(parseResult.output)
			} else {
				throw new Error(
					`Permission denied to open URL: ${parseResult.output}, add permission rule to match URL pattern.`
				)
			}
		},
		openFile: async (path: string) => {
			// check if path is a file and exists
			const p = parse(string(), path)
			if (!(await exists(p))) {
				throw new Error(`File does not exist: ${path}`)
			} else {
				const s = await stat(p)
				if (!s.isFile) {
					throw new Error(`Path is not a file: ${path}`)
				}
			}
			// permission check
			if (
				checkPermission(
					permissions.filter((p) => p.permission === "open:file"),
					p,
					"path"
				)
			) {
				open(p)
			} else {
				throw new Error(
					`Permission denied to open file: ${path}, add permission to match path pattern.`
				)
			}
		},
		openFolder: async (path: string) => {
			// check if path is a directory and exists
			const p = parse(string(), path)
			if (!(await exists(p))) {
				throw new Error(`Directory does not exist: ${path}`)
			} else {
				const s = await stat(p)
				if (!s.isDirectory) {
					throw new Error(`Path is not a directory: ${path}`)
				}
			}
			if (
				checkPermission(
					permissions.filter((p) => p.permission === "open:folder"),
					p,
					"path"
				)
			) {
				open(p)
			} else {
				throw new Error(
					`Permission denied to open foeld: ${path}, add permission to match path pattern.`
				)
			}
		}
	}
}
