import { CustomUiCmd, ExtPackageJsonExtra } from "@kksh/api/models"
import { defineStore } from "pinia"
import { object, optional, string, type InferOutput } from "valibot"

export const WorkerExtMetadata = object({
	manifest: ExtPackageJsonExtra,
	cmdName: string()
})
export type WorkerExtMetadata = InferOutput<typeof WorkerExtMetadata>

export const CustomExtMetadata = object({
	manifest: ExtPackageJsonExtra,
	// url: string(),
	cmd: CustomUiCmd
})
export type CustomExtMetadata = InferOutput<typeof CustomExtMetadata>
export const ExtStoreSchema = object({
	currentWorkerExt: optional(WorkerExtMetadata),
	currentCustomUiExt: optional(CustomExtMetadata)
})
export type ExtStoreState = InferOutput<typeof ExtStoreSchema>

export const useExtStore = defineStore("extension", {
	state: (): ExtStoreState => ({
		currentWorkerExt: undefined,
		currentCustomUiExt: undefined
	}),
	getters: {
		extPath: (state) => state.currentWorkerExt
	},
	actions: {
		setCurrentWorkerExt(ext: WorkerExtMetadata) {
			this.currentWorkerExt = ext
		},
		setCurrentCustomUiExt(ext: CustomExtMetadata) {
			this.currentCustomUiExt = ext
		}
	},
	persist: true
})
