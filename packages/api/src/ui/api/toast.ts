import { proxy as comlinkProxy, type ProxyMarked, type Remote } from "@huakunshen/comlink"
import { getDefaultClientAPI } from "tauri-api-adapter"
import type { GeneralToast, GeneralToastParams, IToast } from "../client"
import type { IToastServer } from "../server"

const defaultClientAPI = getDefaultClientAPI<IToastServer>()

export const toast: IToast = {
	message: (message: string, options?: GeneralToastParams, action?: () => void) =>
		defaultClientAPI.toastMessage(message, options, action ? comlinkProxy(action) : undefined),
	info: (message: string, options?: GeneralToastParams, action?: () => void) =>
		defaultClientAPI.toastInfo(message, options, action ? comlinkProxy(action) : undefined),
	success: (message: string, options?: GeneralToastParams, action?: () => void) =>
		defaultClientAPI.toastSuccess(message, options, action ? comlinkProxy(action) : undefined),
	warning: (message: string, options?: GeneralToastParams, action?: () => void) =>
		defaultClientAPI.toastWarning(message, options, action ? comlinkProxy(action) : undefined),
	error: (message: string, options?: GeneralToastParams, action?: () => void) =>
		defaultClientAPI.toastError(message, options, action ? comlinkProxy(action) : undefined)
}
