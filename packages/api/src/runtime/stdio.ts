import { type StdioInterface } from "@hk/comlink-stdio/browser"
import type { EventEmitter, IOPayload, OutputEvents } from "tauri-plugin-shellx-api"
import type { Child } from "../ui/api/shell"

export class TauriShellStdio implements StdioInterface {
	constructor(
		private readStream: EventEmitter<OutputEvents<IOPayload>>, // stdout of child process
		private childProcess: Child
	) {}

	read(): Promise<string | Buffer | Uint8Array | null> {
		return new Promise((resolve, reject) => {
			this.readStream.on("data", (chunk) => {
				resolve(chunk)
			})
		})
	}
	async write(data: string): Promise<void> {
		return this.childProcess.write(data + "\n")
	}
}
