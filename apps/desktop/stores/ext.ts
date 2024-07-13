// export type ExtState = v.InferOutput<typeof ExtStoreSchema>

// export const $appState = map<ExtState>({
//   currentWorkerExt: undefined
// })

// export function setCurrentWorkerExt(ext: WorkerExtMetadata) {
//   $appState.setKey("currentWorkerExt", ext)
// }

import { defineStore } from "pinia"
import * as v from "valibot"

// import { computed, map } from "nanostores"

export const WorkerExtMetadata = v.object({
  extPath: v.string(),
  cmdName: v.string()
})
export type WorkerExtMetadata = v.InferOutput<typeof WorkerExtMetadata>
export const ExtStoreSchema = v.object({
  currentWorkerExt: v.optional(WorkerExtMetadata)
})
export type ExtStoreState = v.InferOutput<typeof ExtStoreSchema>

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
