import type { DenoSysOptions } from "../../permissions/schema"
import type { DenoRunConfig } from "../client"

class DenoExecutor {
	private _allowNet: string[] = []
	private _allowRead: string[] = []
	private _allowWrite: string[] = []
	private _allowRun: string[] = []
	private _allowEnv: string[] = []
	private _allowFfi: string[] = []
	private _allowSys: string[] = []
	private _denyRead: string[] = []
	private _denyWrite: string[] = []
	private _denyRun: string[] = []
	private _denyEnv: string[] = []
	private _denyFfi: string[] = []
	private _denySys: string[] = []
	private scriptPath: string = ""

	constructor(config: DenoRunConfig) {
		this._allowNet = config.allowNet
		this._allowRead = config.allowRead
		this._allowWrite = config.allowWrite
		this._allowRun = config.allowRun
		this._allowEnv = config.allowEnv
		this._allowFfi = config.allowFfi
		this._allowSys = config.allowSys
		this._denyRead = config.denyRead
		this._denyWrite = config.denyWrite
		this._denyRun = config.denyRun
		this._denyEnv = config.denyEnv
		this._denyFfi = config.denyFfi
		this._denySys = config.denySys
		this.scriptPath = config.scriptPath
	}

	// async execute(): Promise<{ stdout: string, stderr: string, status: Deno.ProcessStatus }> {
	// 	const process = Deno.run({
	// 		cmd: ["deno", "run",
	// 			...this._allowNet.map(p => `--allow-net=${p}`),
	// 			...this._allowRead.map(p => `--allow-read=${p}`),
	// 			...this._allowWrite.map(p => `--allow-write=${p}`),
	// 			...this._allowRun.map(p => `--allow-run=${p}`),
	// 			...this._allowEnv.map(p => `--allow-env=${p}`),
	// 			...this._allowFfi.map(p => `--allow-ffi=${p}`),
	// 			...this._allowSys.map(p => `--allow-sys=${p}`),
	// 			...this._denyRead.map(p => `--deny-read=${p}`),
	// 			...this._denyWrite.map(p => `--deny-write=${p}`),
	// 			...this._denyRun.map(p => `--deny-run=${p}`),
	// 			...this._denyEnv.map(p => `--deny-env=${p}`),
	// 			...this._denyFfi.map(p => `--deny-ffi=${p}`),
	// 			...this._denySys.map(p => `--deny-sys=${p}`),
	// 			this.scriptPath,
	// 		,
	// 		stdout: "piped",
	// 		stderr: "piped"
	// 	});
	
}

