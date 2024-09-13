import { proxy as comlinkProxy, type Remote } from "@huakunshen/comlink"
import { Channel, invoke } from "@tauri-apps/api/core"
import { constructShellAPI as constructShellAPI1 } from "tauri-api-adapter/client"
import {
	Child,
	EventEmitter,
	hasCommand,
	likelyOnWindows,
	open as shellxOpen,
	// EventEmitter,
	// Command as ShellxCommand,
	type ChildProcess,
	type CommandEvent,
	type CommandEvents,
	type InternalSpawnOptions,
	type IOPayload,
	type OutputEvents,
	type SpawnOptions
} from "tauri-plugin-shellx-api"
import { type DenoRunConfig } from "../client"
import type { IShellServer } from "../server/server-types"

class BaseShellCommand<O extends IOPayload> extends EventEmitter<CommandEvents> {
	/** @ignore Program to execute. */
	readonly program: string
	/** @ignore Program arguments */
	readonly args: string[]
	/** @ignore Spawn options. */
	readonly options: SpawnOptions
	/** Event emitter for the `stdout`. Emits the `data` event. */
	readonly stdout = new EventEmitter<OutputEvents<O>>()
	/** Event emitter for the `stderr`. Emits the `data` event. */
	readonly stderr = new EventEmitter<OutputEvents<O>>()

	/**
	 * @ignore
	 * Creates a new `Command` instance.
	 *
	 * @param program The program name to execute.
	 * It must be configured on `tauri.conf.json > plugins > shell > scope`.
	 * @param args Program arguments.
	 * @param options Spawn options.
	 */
	constructor(program: string, args: string | string[] = [], options?: SpawnOptions) {
		super()
		this.program = program
		this.args = typeof args === "string" ? [args] : args
		this.options = options ?? {}
	}
}

class Command<O extends IOPayload> extends BaseShellCommand<O> {
	api: Remote<IShellServer>

	constructor(
		program: string,
		args: string | string[] = [],
		api: Remote<IShellServer>,
		options?: SpawnOptions
	) {
		super(program, args, options)
		this.api = api
	}

	async spawn(): Promise<Child> {
		const args = this.args

		if (typeof args === "object") {
			Object.freeze(args)
		}

		return this.api
			.rawSpawn(
				this.program,
				args,
				this.options,
				comlinkProxy((evt) => {
					switch (evt.event) {
						case "Error":
							this.emit("error", evt.payload)
							break
						case "Terminated":
							this.emit("close", evt.payload)
							break
						case "Stdout":
							this.stdout.emit("data", evt.payload as O)
							break
						case "Stderr":
							this.stderr.emit("data", evt.payload as O)
							break
					}
				})
			)
			.then((pid) => new Child(pid))
	}

	async execute(): Promise<ChildProcess<O>> {
		const args = this.args
		if (typeof args === "object") {
			Object.freeze(args)
		}
		return this.api.execute(this.program, this.args, this.options) as Promise<ChildProcess<O>>
	}
}

class DenoCommand<O extends IOPayload> extends BaseShellCommand<O> {
	config: DenoRunConfig
	scriptPath: string
	api: Remote<IShellServer>

	constructor(
		scriptPath: string,
		args: string[],
		config: DenoRunConfig,
		api: Remote<IShellServer>
	) {
		super("deno", args)
		this.config = config
		this.scriptPath = scriptPath
		this.api = api
	}

	execute(): Promise<ChildProcess<O>> {
		return this.api.denoExecute(this.scriptPath, this.config, this.args) as Promise<ChildProcess<O>>
	}

	spawn(): Promise<Child> {
		return this.api
			.denoRawSpawn(
				this.scriptPath,
				this.config,
				this.args,
				comlinkProxy((evt) => {
					switch (evt.event) {
						case "Error":
							this.emit("error", evt.payload)
							break
						case "Terminated":
							this.emit("close", evt.payload)
							break
						case "Stdout":
							this.stdout.emit("data", evt.payload as O)
							break
						case "Stderr":
							this.stderr.emit("data", evt.payload as O)
							break
					}
				})
			)
			.then((pid) => new Child(pid))
	}
}

export type IShell = {
	// Command: typeof Command
	// DenoCommand: typeof DenoCommand
	createCommand: (
		program: string,
		args: string | string[],
		options?: SpawnOptions
	) => Command<string>
	createDenoCommand: (
		scriptPath: string,
		args: string[],
		config: Partial<DenoRunConfig> & SpawnOptions
	) => DenoCommand<string>
	open: typeof shellxOpen
	makeBashScript: (script: string) => Command<string>
	makePowershellScript: (script: string) => Command<string>
	makeAppleScript: (script: string) => Command<string>
	makePythonScript: (script: string) => Command<string>
	makeZshScript: (script: string) => Command<string>
	makeNodeScript: (script: string) => Command<string>
	executeBashScript: (script: string) => Promise<ChildProcess<string>>
	executePowershellScript: (script: string) => Promise<ChildProcess<string>>
	executeAppleScript: (script: string) => Promise<ChildProcess<string>>
	executePythonScript: (script: string) => Promise<ChildProcess<string>>
	executeZshScript: (script: string) => Promise<ChildProcess<string>>
	executeNodeScript: (script: string) => Promise<ChildProcess<string>>
	hasCommand: typeof hasCommand
	likelyOnWindows: typeof likelyOnWindows
	Child: typeof Child
}

export function constructShellAPI(api: Remote<IShellServer>): IShell {
	// const originalAPI = constructShellAPI1(api)
	function createCommand(program: string, args: string | string[] = [], options?: SpawnOptions) {
		return new Command<string>(program, args, api, options)
	}

	function createDenoCommand(
		scriptPath: string,
		args: string[],
		config: Partial<DenoRunConfig> & SpawnOptions
	) {
		return new DenoCommand<string>(scriptPath, args, config, api)
	}

	function makeBashScript(script: string): Command<string> {
		return createCommand("bash", ["-c", script])
	}

	function makePowershellScript(script: string): Command<string> {
		return createCommand("powershell", ["-Command", script])
	}

	function makeAppleScript(script: string): Command<string> {
		return createCommand("osascript", ["-e", script])
	}

	function makePythonScript(script: string): Command<string> {
		return createCommand("python", ["-c", script])
	}

	function makeZshScript(script: string): Command<string> {
		return createCommand("zsh", ["-c", script])
	}

	function makeNodeScript(script: string): Command<string> {
		return createCommand("node", ["-e", script])
	}

	async function executeBashScript(script: string): Promise<ChildProcess<string>> {
		return makeBashScript(script).execute()
	}

	async function executePowershellScript(script: string): Promise<ChildProcess<string>> {
		return makePowershellScript(script).execute()
	}

	async function executeAppleScript(script: string): Promise<ChildProcess<string>> {
		return makeAppleScript(script).execute()
	}

	async function executePythonScript(script: string): Promise<ChildProcess<string>> {
		return makePythonScript(script).execute()
	}

	async function executeZshScript(script: string): Promise<ChildProcess<string>> {
		return makeZshScript(script).execute()
	}

	async function executeNodeScript(script: string): Promise<ChildProcess<string>> {
		return makeNodeScript(script).execute()
	}

	/**
	 * Run powershell.exe -Command 'echo $env:OS' to determine if the current platform is likely to be Windows.
	 * Not 100% accurate. If a Mac or Linux somehow has powershell.exe in PATH, this will return true.
	 * @returns Whether the current platform is likely to be Windows.
	 */
	function likelyOnWindows(): Promise<boolean> {
		return createCommand("powershell.exe", ["-Command", "echo $env:OS"])
			.execute()
			.then((out) => out.code === 0 && out.stdout.toLowerCase().includes("windows"))
			.catch(() => false)
	}

	/**
	 * Determine if a command is available with `which` or `where` command.
	 * Support Windows, Mac, Linux
	 * @param command
	 * @returns
	 */
	async function hasCommand(command: string): Promise<boolean> {
		const targetCmd = command.split(" ")[0]
		const isOnWindows = await likelyOnWindows()
		const whereCmd = isOnWindows ? "where" : "which"
		const cmd = createCommand(whereCmd, [targetCmd])
		const out = await cmd.execute()
		return out.code === 0
	}

	return {
		open: api.open,
		makeBashScript,
		makePowershellScript,
		makeAppleScript,
		makePythonScript,
		makeZshScript,
		makeNodeScript,
		executeBashScript,
		executePowershellScript,
		executeAppleScript,
		executePythonScript,
		executeZshScript,
		executeNodeScript,
		hasCommand,
		likelyOnWindows,
		createCommand,
		createDenoCommand,
		Child
	}
}
