import { Channel, invoke } from "@tauri-apps/api/core"
import { type IShellServer } from "tauri-api-adapter"
import {
	Child,
	Command,
	executeAppleScript,
	executeBashScript,
	executeNodeScript,
	executePowershellScript,
	executePythonScript,
	executeZshScript,
	hasCommand,
	likelyOnWindows,
	makeAppleScript,
	makeBashScript,
	makeNodeScript,
	makePowershellScript,
	makePythonScript,
	makeZshScript,
	open,
	type ChildProcess,
	type CommandEvent,
	type InternalSpawnOptions,
	type IOPayload,
	type SpawnOptions
} from "tauri-plugin-shellx-api"
import { ShellPermissionMap } from "../../permissions/permission-map"
import { type ShellPermission, type ShellPermissionScoped } from "../../permissions/schema"
import { verifyScopedPermission } from "../../utils/path"

function matchRegexArgs(args: string[], regexes: string[]): boolean {
	if (args.length !== regexes.length) {
		return false
	}
	for (let i = 0; i < args.length; i++) {
		if (!new RegExp(regexes[i]).test(args[i])) {
			return false
		}
	}
	return true
}

async function verifyShellCmdPermission(
	requiredPermissions: ShellPermission[],
	userPermissionScopes: ShellPermissionScoped[],
	program: string,
	args: string[]
): Promise<boolean> {
	for (const permission of userPermissionScopes) {
		if (requiredPermissions.includes(permission.permission)) {
			for (const deny of permission.deny || []) {
				if (deny.cmd && deny.cmd.program === program && matchRegexArgs(args, deny.cmd.args || [])) {
					return false
				}
			}
			for (const allow of permission.allow || []) {
				if (
					allow.cmd &&
					allow.cmd.program === program &&
					matchRegexArgs(args, allow.cmd.args || [])
				) {
					return true
				}
			}
		}
	}
	return false
}

/**
 * `tauri-api-adapter` provides shell API.
 * In kunkun I provide a more granular permission system and extra shell script execution APIs, so I rewrite the shell server API constructor
 * @param permissions
 * @returns
 */
export function constructShellApi(
	permissions: (ShellPermissionScoped | ShellPermission)[]
): IShellServer {
	const stringPermissiongs = permissions.filter((p) => typeof p === "string") as ShellPermission[]
	const objectPermissions = permissions.filter(
		(p) => typeof p !== "string"
	) as ShellPermissionScoped[]
	return {
		execute: async (
			program: string,
			args: string[],
			options: InternalSpawnOptions
		): Promise<ChildProcess<IOPayload>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.execute,
					objectPermissions,
					program,
					args
				))
			) {
				return Promise.reject(new Error("Shell Execute Permission denied"))
			}
			return invoke<ChildProcess<IOPayload>>("plugin:shellx|execute", {
				program: program,
				args: args,
				options: options
			})
		},
		kill: (pid: number) => {
			if (!stringPermissiongs.some((p) => ShellPermissionMap.kill.includes(p)))
				return Promise.reject(
					new Error(`Permission denied. Requires one of ${ShellPermissionMap.kill}`)
				)
			return invoke<void>("plugin:shellx|kill", {
				cmd: "killChild",
				pid: pid
			})
		},
		stdinWrite: (buffer: string | number[], pid: number) => {
			if (!stringPermissiongs.some((p) => ShellPermissionMap.stdinWrite.includes(p)))
				return Promise.reject(
					new Error(`Permission denied. Requires one of ${ShellPermissionMap.stdinWrite}`)
				)
			return invoke("plugin:shellx|stdin_write", {
				buffer: buffer,
				pid: pid
			})
		},
		open: async (path: string, openWith?: string) => {
			// TODO: consider adding a base dir option like the fs api's
			// this should throw if permission is denied
			if (
				await verifyScopedPermission(
					objectPermissions.filter(
						(p) => p.permission === "shell:open" || p.permission === "shell:all"
					),
					path,
					"url"
				)
			) {
				return open(path, openWith)
			} else {
				throw new Error(`Permission denied to open file: ${path}`)
			}
		},
		// shellOpen: verifyShellCmdPermission(["shell:open"], permissions)(shellOpen),
		rawSpawn: async <O extends IOPayload>(
			program: string,
			args: string[],
			options: InternalSpawnOptions,
			cb: (evt: CommandEvent<O>) => void
		) => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.rawSpawn,
					objectPermissions,
					program,
					args
				))
			) {
				return Promise.reject(new Error("Shell Spawn Permission denied"))
			}
			const onEvent = new Channel<CommandEvent<O>>()
			onEvent.onmessage = cb
			return invoke<number>("plugin:shellx|spawn", {
				program: program,
				args: args,
				options: options,
				onEvent
			})
		},
		executeBashScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(ShellPermissionMap.execute, objectPermissions, "bash", [
					"-c",
					script
				]))
			) {
				return Promise.reject(new Error("Shell Execute (Bash) Permission denied"))
			}
			return executeBashScript(script)
		},
		executePowershellScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.executePowershellScript,
					objectPermissions,
					"powershell",
					["-Command", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (PowerShell) Permission denied"))
			}
			return executePowershellScript(script)
		},
		executeAppleScript: async (script: string): Promise<ChildProcess<string>> => {
			console.log("shellExecuteAppleScript", script)
			console.log("objectPermissions", objectPermissions)

			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.executeAppleScript,
					objectPermissions,
					"osascript",
					["-e", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (AppleScript) Permission denied"))
			}
			return executeAppleScript(script)
		},
		executePythonScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.executePythonScript,
					objectPermissions,
					"python",
					["-c", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (Python) Permission denied"))
			}
			return executePythonScript(script)
		},
		executeZshScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.executeZshScript,
					objectPermissions,
					"zsh",
					["-c", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (ZSH) Permission denied"))
			}
			return executeZshScript(script)
		},
		executeNodeScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.executeNodeScript,
					objectPermissions,
					"node",
					["-e", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (Node) Permission denied"))
			}
			return executeNodeScript(script)
		},
		hasCommand: async (command: string): Promise<boolean> => {
			// check if command is clean, check if it's a single command without arguments or semicolons with regex.
			if (!/^[a-zA-Z0-9_-]+$/.test(command)) {
				return Promise.reject(new Error("Invalid command"))
			}
			return hasCommand(command)
		},
		likelyOnWindows: async (): Promise<boolean> => likelyOnWindows()
	}
}
