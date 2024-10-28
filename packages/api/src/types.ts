/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
export * from "./ui/client" // all client types

/* -------------------------------------------------------------------------- */
/*                               API Interfaces                               */
/* -------------------------------------------------------------------------- */
export type {
	IClipboard,
	IDialog,
	ILogger,
	INetwork,
	INotification,
	IOs,
	IPath,
	// IShell,
	ISystemInfo,
	IUpdownload,
	IFetch
} from "tauri-api-adapter"
// export type { ISystem, IToast, IUiWorker, IUiIframe, IDb, IFs, IOpen, IEvent } from "./ui/client"
export type { IShell } from "./ui/api/shell"
