import { describe, expect, test } from "bun:test"
import { translateDenoCommand } from "../deno"

test("translateDenoCommand", () => {
	const cmdOptions = translateDenoCommand("test.ts", {
		allowAllEnv: false,
		allowEnv: ["PATH"],
		allowAllNet: true,
		allowNet: [],
		denyAllRead: true
	})

	expect(cmdOptions.args).toEqual([
		"run",
		"--allow-env=PATH",
		"--allow-net",
		"--deny-read",
		"test.ts"
	])
	console.log(cmdOptions)
})
