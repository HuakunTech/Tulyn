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
	options?: GeneralToastParams
): Promise<void> {
	await fn(
		message,
		options
			? {
					description: options.description,
					duration: options.duration,
					closeButton: options.closeButton,
					position: options.position
				}
			: undefined
	)
}

export function constructToastApi(): IToastServer {
	return {
		toastMessage: async (message: string, options?: GeneralToastParams) => {
			constructToast(toast.message, message, options)
		},
		toastInfo: async (message: string, options?: GeneralToastParams) => {
			constructToast(toast.info, message, options)
		},
		toastSuccess: async (message: string, options?: GeneralToastParams) => {
			constructToast(toast.success, message, options)
		},
		toastWarning: async (message: string, options?: GeneralToastParams) => {
			constructToast(toast.warning, message, options)
		},
		toastError: async (message: string, options?: GeneralToastParams) => {
			constructToast(toast.error, message, options)
		}
	}
}
