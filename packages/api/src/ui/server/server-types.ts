// import type { IEvent, IFs, ISystem } from "../client"

import type { IUiIframe } from "../client"

// export interface IFsServer {
// 	readDir: IFs["readDir"]
// 	readFile: IFs["readFile"]
// 	readTextFile: IFs["readTextFile"]
// 	stat: IFs["stat"]
// 	lstat: IFs["lstat"]
// 	exists: IFs["exists"]
// 	mkdir: IFs["mkdir"]
// 	create: IFs["create"]
// 	copyFile: IFs["copyFile"]
// 	remove: IFs["remove"]
// 	rename: IFs["rename"]
// 	truncate: IFs["truncate"]
// 	writeFile: IFs["writeFile"]
// 	writeTextFile: IFs["writeTextFile"]
// 	fileSearch: IFs["fileSearch"]
// }

// export interface ISystemServer {
// 	openTrash: ISystem["openTrash"]
// 	emptyTrash: ISystem["emptyTrash"]
// 	shutdown: ISystem["shutdown"]
// 	reboot: ISystem["reboot"]
// 	sleep: ISystem["sleep"]
// 	toggleSystemAppearance: ISystem["toggleSystemAppearance"]
// 	showDesktop: ISystem["showDesktop"]
// 	quitAllApps: ISystem["quitAllApps"]
// 	sleepDisplays: ISystem["sleepDisplays"]
// 	setVolume: ISystem["setVolume"]
// 	setVolumeTo0: ISystem["setVolumeTo0"]
// 	setVolumeTo25: ISystem["setVolumeTo25"]
// 	setVolumeTo50: ISystem["setVolumeTo50"]
// 	setVolumeTo75: ISystem["setVolumeTo75"]
// 	setVolumeTo100: ISystem["setVolumeTo100"]
// 	turnVolumeUp: ISystem["turnVolumeUp"]
// 	turnVolumeDown: ISystem["turnVolumeDown"]
// 	toggleStageManager: ISystem["toggleStageManager"]
// 	toggleBluetooth: ISystem["toggleBluetooth"]
// 	toggleHiddenFiles: ISystem["toggleHiddenFiles"]
// 	ejectAllDisks: ISystem["ejectAllDisks"]
// 	logoutUser: ISystem["logoutUser"]
// 	toggleMute: ISystem["toggleMute"]
// 	mute: ISystem["mute"]
// 	unmute: ISystem["unmute"]
// 	getFrontmostApp: ISystem["getFrontmostApp"]
// 	hideAllAppsExceptFrontmost: ISystem["hideAllAppsExceptFrontmost"]
// 	getSelectedFilesInFileExplorer: ISystem["getSelectedFilesInFileExplorer"]
// }

// export interface IEventServer {
// 	onDragDrop: IEvent["onDragDrop"]
// 	onDragEnter: IEvent["onDragEnter"]
// 	onDragLeave: IEvent["onDragLeave"]
// 	onDragOver: IEvent["onDragOver"]
// 	onWindowBlur: IEvent["onWindowBlur"]
// 	onWindowCloseRequested: IEvent["onWindowCloseRequested"]
// 	onWindowFocus: IEvent["onWindowFocus"]
// }

// This will be implemented in the @kksh/api package
export type IUiIframeServer1 = Pick<
	IUiIframe,
	"startDragging" | "toggleMaximize" | "internalToggleMaximize"
>
// This interface will be implemented in iframe-ext.vue where iframe is loaded and API is exposed
// because these API dependes on the context of the page
export type IUiIframeServer2 = Omit<
	IUiIframe,
	"registerDragRegion" | "internalToggleMaximize" | "toggleMaximize" | "startDragging"
>
