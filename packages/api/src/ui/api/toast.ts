import { getDefaultClientAPI } from "tauri-api-adapter"
import type { IToast } from "../client"
import type { IToastServer } from "../server"

const defaultClientAPI = getDefaultClientAPI<IToastServer>()

export const toast: IToast = {
  message: defaultClientAPI.toastMessage,
  info: defaultClientAPI.toastInfo,
  success: defaultClientAPI.toastSuccess,
  warning: defaultClientAPI.toastWarning,
  error: defaultClientAPI.toastError
}
