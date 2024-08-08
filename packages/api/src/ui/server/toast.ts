import { toast } from "vue-sonner"
import type {
	GeneralToast,
	GeneralToastParams,
	IDb,
	IFs,
	ISystem,
	IToast,
	IUiIframe,
	IUiWorker
} from "../client"

export interface IToastServer {
	toastMessage: IToast["message"]
	toastInfo: IToast["info"]
	toastSuccess: IToast["success"]
	toastWarning: IToast["warning"]
	toastError: IToast["error"]
}

async function constructToast(
	fn:
		| typeof toast.message
		| typeof toast.info
		| typeof toast.success
		| typeof toast.warning
		| typeof toast.error,
	message: string,
	options?: GeneralToastParams,
	action?: () => void
): Promise<void> {
	await fn(message, {
		...options,
		action:
			action && options?.actionLabel
				? {
						label: options?.actionLabel ?? "Action",
						onClick: () => {
							action()
						}
					}
				: undefined
	})
}

export function constructToastApi(): IToastServer {
	return {
		toastMessage: async (message: string, options?: GeneralToastParams, action?: () => void) => {
			console.log("Server Message")
			constructToast(toast.message, message, options, action)
		},
		toastInfo: async (message: string, options?: GeneralToastParams, action?: () => void) => {
			constructToast(toast.info, message, options, action)
		},
		toastSuccess: async (message: string, options?: GeneralToastParams, action?: () => void) => {
			constructToast(toast.success, message, options, action)
		},
		toastWarning: async (message: string, options?: GeneralToastParams, action?: () => void) => {
			constructToast(toast.warning, message, options, action)
		},
		toastError: async (message: string, options?: GeneralToastParams, action?: () => void) => {
			constructToast(toast.error, message, options, action)
		}
	}
}
