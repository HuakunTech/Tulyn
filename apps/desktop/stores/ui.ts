import { Action as ActionSchema } from "jarvis-api/models"
import { defineStore } from "pinia"
import { object, optional, string, type InferOutput } from "valibot"

export const UiStateSchema = object({
  actionPanel: optional(ActionSchema.ActionPanel)
})
export type UiState = InferOutput<typeof UiStateSchema>

export const useAppUiStore = defineStore("app-ui-store", {
  state: (): UiState => ({
    actionPanel: undefined
  }),
  actions: {
    setActionPanel(actionPanel?: ActionSchema.ActionPanel) {
      this.actionPanel = actionPanel
    }
  }
})
