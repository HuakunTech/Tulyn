import { defineStore } from "pinia"
import { object, optional, string, type InferOutput } from "valibot"

export const WorkerExtMetadata = object({
  extPath: string(),
  cmdName: string()
})
export type WorkerExtMetadata = InferOutput<typeof WorkerExtMetadata>
export const ExtStoreSchema = object({
  currentWorkerExt: optional(WorkerExtMetadata)
})
export type ExtStoreState = InferOutput<typeof ExtStoreSchema>

export const useExtStore = defineStore("extension", {
  state: (): ExtStoreState => ({
    currentWorkerExt: undefined
  }),
  getters: {
    extPath: (state) => state.currentWorkerExt
  },
  actions: {
    setCurrentWorkerExt(ext: WorkerExtMetadata) {
      this.currentWorkerExt = ext
    }
  },
  persist: true
})
