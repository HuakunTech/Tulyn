import { toast } from "vue-sonner"
import type { IDb, IFs, ISystem, IToast, IUiIframe, IUiWorker } from "../client"

export interface IToastServer {
	toastMessage: IToast["message"]
	toastInfo: IToast["info"]
	toastSuccess: IToast["success"]
	toastWarning: IToast["warning"]
	toastError: IToast["error"]
}

export function constructToastApi(): IToastServer {
	return {
		toastMessage: (...args: Parameters<typeof toast.message>) =>
			Promise.resolve(toast.message(...args)),
		toastInfo: (...args: Parameters<typeof toast.message>) => Promise.resolve(toast.info(...args)),
		toastSuccess: (...args: Parameters<typeof toast.message>) =>
			Promise.resolve(toast.success(...args)),
		toastWarning: (...args: Parameters<typeof toast.message>) =>
			Promise.resolve(toast.warning(...args)),
		toastError: (...args: Parameters<typeof toast.message>) => Promise.resolve(toast.error(...args))
	}
}
