import { Channel, invoke } from "@tauri-apps/api/core"
import { type IShellServer } from "tauri-api-adapter"
import {
	Child as ShellxChild,
	Command as ShellxCommand,
	executeAppleScript as shellxExecuteAppleScript,
	executeBashScript as shellxExecuteBashScript,
	executeNodeScript as shellxExecuteNodeScript,
	executePowershellScript as shellxExecutePowershellScript,
	executePythonScript as shellxExecutePythonScript,
	executeZshScript as shellxExecuteZshScript,
	hasCommand as shellxHasCommand,
	likelyOnWindows as shellxLikelyOnWindows,
	makeAppleScript as shellxMakeAppleScript,
	makeBashScript as shellxMakeBashScript,
	makeNodeScript as shellxMakeNodeScript,
	makePowershellScript as shellxMakePowershellScript,
	makePythonScript as shellxMakePythonScript,
	makeZshScript as shellxMakeZshScript,
	open as shellxOpen,
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

export function constructShellApi(
	permissions: (ShellPermissionScoped | ShellPermission)[]
): IShellServer {
	const stringPermissiongs = permissions.filter((p) => typeof p === "string") as ShellPermission[]
	const objectPermissions = permissions.filter(
		(p) => typeof p !== "string"
	) as ShellPermissionScoped[]
	return {
		shellExecute: async (
			program: string,
			args: string[],
			options: InternalSpawnOptions
		): Promise<ChildProcess<IOPayload>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellExecute,
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
		shellKill: (pid: number) => {
			if (!stringPermissiongs.some((p) => ShellPermissionMap.shellKill.includes(p)))
				return Promise.reject(
					new Error(`Permission denied. Requires one of ${ShellPermissionMap.shellKill}`)
				)
			return invoke<void>("plugin:shellx|kill", {
				cmd: "killChild",
				pid: pid
			})
		},
		shellStdinWrite: (buffer: string | number[], pid: number) => {
			if (!stringPermissiongs.some((p) => ShellPermissionMap.shellStdinWrite.includes(p)))
				return Promise.reject(
					new Error(`Permission denied. Requires one of ${ShellPermissionMap.shellStdinWrite}`)
				)
			return invoke("plugin:shellx|stdin_write", {
				buffer: buffer,
				pid: pid
			})
		},
		shellOpen: async (path: string, openWith?: string) => {
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
				return shellxOpen(path, openWith)
			} else {
				throw new Error(`Permission denied to open file: ${path}`)
			}
		},
		// shellOpen: verifyShellCmdPermission(["shell:open"], permissions)(shellOpen),
		shellRawSpawn: async <O extends IOPayload>(
			program: string,
			args: string[],
			options: InternalSpawnOptions,
			cb: (evt: CommandEvent<O>) => void
		) => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellRawSpawn,
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
		shellExecuteBashScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellExecute,
					objectPermissions,
					"bash",
					["-c", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (Bash) Permission denied"))
			}
			return shellxExecuteBashScript(script)
		},
		shellExecutePowershellScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellExecutePowershellScript,
					objectPermissions,
					"powershell",
					["-Command", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (PowerShell) Permission denied"))
			}
			return shellxExecutePowershellScript(script)
		},
		shellExecuteAppleScript: async (script: string): Promise<ChildProcess<string>> => {
			console.log("shellExecuteAppleScript", script)
			console.log("objectPermissions", objectPermissions)

			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellExecuteAppleScript,
					objectPermissions,
					"osascript",
					["-e", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (AppleScript) Permission denied"))
			}
			return shellxExecuteAppleScript(script)
		},
		shellExecutePythonScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellExecutePythonScript,
					objectPermissions,
					"python",
					["-c", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (Python) Permission denied"))
			}
			return shellxExecutePythonScript(script)
		},
		shellExecuteZshScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellExecuteZshScript,
					objectPermissions,
					"zsh",
					["-c", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (ZSH) Permission denied"))
			}
			return shellxExecuteZshScript(script)
		},
		shellExecuteNodeScript: async (script: string): Promise<ChildProcess<string>> => {
			if (
				!(await verifyShellCmdPermission(
					ShellPermissionMap.shellExecuteNodeScript,
					objectPermissions,
					"node",
					["-e", script]
				))
			) {
				return Promise.reject(new Error("Shell Execute (Node) Permission denied"))
			}
			return shellxExecuteNodeScript(script)
		},
		shellHasCommand: async (command: string): Promise<boolean> => {
			// check if command is clean, check if it's a single command without arguments or semicolons with regex.
			if (!/^[a-zA-Z0-9_-]+$/.test(command)) {
				return Promise.reject(new Error("Invalid command"))
			}
			return shellxHasCommand(command)
		},
		shellLikelyOnWindows: async (): Promise<boolean> => shellxLikelyOnWindows()
	}
}
