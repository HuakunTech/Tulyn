import type { InternalSpawnOptions } from "tauri-plugin-shellx-api"
import { safeParse } from "valibot"
import {
	DenoPermissionScopedSchema,
	DenoPermissionScopeSchema,
	DenoRuntimePermissionSchema,
	PermissionScopeSchema,
	type DenoPermissionScoped,
	type DenoRuntimePermission,
	type ShellPermission,
	type ShellPermissionScoped
} from "../../permissions/schema"
import { type DenoRunConfig } from "../client"

function match(path: string, pattern: string) {
	return false // TODO
}

/**
 * 
 * @param userPermissionScopes 
 * @param program should be deno for now, may be I will support custom deno path in the future
 * @param scriptPath absolute path to deno script
 * @param config 
 */
export function verifyDenoCmdPermission(
	userPermissionScopes: DenoPermissionScoped[],
	program: string,
	scriptPath: string,
	config: Partial<DenoRunConfig> & InternalSpawnOptions
) {
	// DenoRuntimePermissionSchema
	// PermissionScopeSchema
	const userPerms = userPermissionScopes.filter(
		(p) => p.permission && p.permission.startsWith("deno:")
	)
	const pathMatchedPerms: DenoPermissionScoped[] = []
	for (const perm of userPerms) {
		const safeParsed = safeParse(DenoPermissionScopedSchema, perm)
		if (!safeParsed.success) {
			throw new Error(`Invalid permission: ${perm}`)
		}
		const parsedPerm = safeParsed.output
		// ignore the ones whose path doesn't match
		let pathMatched = false
		if (parsedPerm.allow) {
			for (const allow of parsedPerm.allow) {
				if (allow.path && match(scriptPath, allow.path)) {
					pathMatched = true
				}
			}
		}
		if (parsedPerm.deny) {
			for (const deny of parsedPerm.deny) {
				if (deny.path && match(scriptPath, deny.path)) {
					pathMatched = true
				}
			}
		}
		if (pathMatched) {
			pathMatchedPerms.push(parsedPerm)
		}
	}

	/* -------------------- Start Verifying Deno Permissions -------------------- */
	for (const perm of pathMatchedPerms) {
		if (perm.allow) {
			for (const allow of perm.allow) {
				
			}
		}
	}
}

/* -------------------------------------------------------------------------- */
/*                 Translate Deno Command to a regular command                */
/* -------------------------------------------------------------------------- */
export function translateDenoCommand(
	scriptPath: string,
	config: Partial<DenoRunConfig> & InternalSpawnOptions
): {
	program: string
	args: string[]
	options: InternalSpawnOptions
} {
	const program = "deno" // TODO: support custom deno path
	const args = ["run"]
	/* ----------------------------------- Env ---------------------------------- */
	if (config.allowAllEnv) {
		args.push("--allow-env")
	} else if (config.allowEnv) {
		const allowEnvStr = config.allowEnv.join(",")
		args.push(`--allow-env=${allowEnvStr}`)
	}
	if (config.denyAllEnv) {
		args.push("--deny-env")
	} else if (config.denyEnv) {
		const denyEnvStr = config.denyEnv.join(",")
		args.push(`--deny-env=${denyEnvStr}`)
	}
	/* ----------------------------------- Net ---------------------------------- */
	if (config.allowAllNet) {
		args.push("--allow-net")
	} else if (config.allowNet) {
		const allowNetStr = config.allowNet.join(",")
		args.push(`--allow-net=${allowNetStr}`)
	}
	if (config.denyAllNet) {
		args.push("--deny-net")
	} else if (config.denyNet) {
		const denyNetStr = config.denyNet.join(",")
		args.push(`--deny-net=${denyNetStr}`)
	}
	/* ----------------------------------- Read ---------------------------------- */
	if (config.allowAllRead) {
		args.push("--allow-read")
	} else if (config.allowRead) {
		const allowReadStr = config.allowRead.join(",")
		args.push(`--allow-read=${allowReadStr}`)
	}
	if (config.denyAllRead) {
		args.push("--deny-read")
	} else if (config.denyRead) {
		const denyReadStr = config.denyRead.join(",")
		args.push(`--deny-read=${denyReadStr}`)
	}
	/* ----------------------------------- Write ---------------------------------- */
	if (config.allowAllWrite) {
		args.push("--allow-write")
	} else if (config.allowWrite) {
		const allowWriteStr = config.allowWrite.join(",")
		args.push(`--allow-write=${allowWriteStr}`)
	}
	if (config.denyAllWrite) {
		args.push("--deny-write")
	} else if (config.denyWrite) {
		const denyWriteStr = config.denyWrite.join(",")
		args.push(`--deny-write=${denyWriteStr}`)
	}
	/* ----------------------------------- Run ---------------------------------- */
	if (config.allowAllRun) {
		args.push("--allow-run")
	} else if (config.allowRun) {
		const allowRunStr = config.allowRun.join(",")
		args.push(`--allow-run=${allowRunStr}`)
	}
	if (config.denyAllRun) {
		args.push("--deny-run")
	} else if (config.denyRun) {
		const denyRunStr = config.denyRun.join(",")
		args.push(`--deny-run=${denyRunStr}`)
	}
	/* ----------------------------------- Ffi ---------------------------------- */
	if (config.allowAllFfi) {
		args.push("--allow-ffi")
	} else if (config.allowFfi) {
		const allowFfiStr = config.allowFfi.join(",")
		args.push(`--allow-ffi=${allowFfiStr}`)
	}
	if (config.denyAllFfi) {
		args.push("--deny-ffi")
	} else if (config.denyFfi) {
		const denyFfiStr = config.denyFfi.join(",")
		args.push(`--deny-ffi=${denyFfiStr}`)
	}
	/* ----------------------------------- Sys ---------------------------------- */
	if (config.allowAllSys) {
		args.push("--allow-sys")
	} else if (config.allowSys) {
		const allowSysStr = config.allowSys.join(",")
		args.push(`--allow-sys=${allowSysStr}`)
	}
	if (config.denyAllSys) {
		args.push("--deny-sys")
	} else if (config.denySys) {
		const denySysStr = config.denySys.join(",")
		args.push(`--deny-sys=${denySysStr}`)
	}
	/* ----------------------------------- Script ---------------------------------- */
	args.push(scriptPath)
	return {
		program,
		args,
		options: {
			cwd: config.cwd,
			env: config.env,
			encoding: config.encoding,
			sidecar: config.sidecar
		}
	}
}
