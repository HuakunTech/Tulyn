import type {
	copyFile,
	create,
	exists,
	lstat,
	mkdir,
	readDir,
	readFile,
	readTextFile,
	remove,
	rename,
	stat,
	truncate,
	writeFile,
	writeTextFile
} from "@tauri-apps/plugin-fs"
import type { toast } from "vue-sonner"
import { type JarvisExtDB } from "../commands/db"
import type { fileSearch } from "../commands/fileSearch"
import { type AppInfo } from "../models/apps"
import type { LightMode, Position, Radius, ThemeColor } from "../models/styles"
import { type IComponent } from "./worker/components/interfaces"
import * as FormSchema from "./worker/schema/form"
import * as ListSchema from "./worker/schema/list"

type PromiseWrap<T extends (...args: any[]) => any> = (
	...args: Parameters<T>
) => Promise<ReturnType<T>>

export interface ISystem {
	openTrash(): Promise<void>
	emptyTrash(): Promise<void>
	shutdown(): Promise<void>
	reboot(): Promise<void>
	sleep(): Promise<void>
	toggleSystemAppearance(): Promise<void>
	showDesktop(): Promise<void>
	quitAllApps(): Promise<void>
	sleepDisplays(): Promise<void>
	setVolume(percentage: number): Promise<void>
	setVolumeTo0(): Promise<void>
	setVolumeTo25(): Promise<void>
	setVolumeTo50(): Promise<void>
	setVolumeTo75(): Promise<void>
	setVolumeTo100(): Promise<void>
	turnVolumeUp(): Promise<void>
	turnVolumeDown(): Promise<void>
	toggleStageManager(): Promise<void>
	toggleBluetooth(): Promise<void>
	toggleHiddenFiles(): Promise<void>
	ejectAllDisks(): Promise<void>
	logoutUser(): Promise<void>
	toggleMute(): Promise<void>
	mute(): Promise<void>
	unmute(): Promise<void>
	getFrontmostApp(): Promise<AppInfo>
	hideAllAppsExceptFrontmost(): Promise<void>
	getSelectedFilesInFileExplorer(): Promise<string[]>
}

export interface IToast {
	message: PromiseWrap<typeof toast.message>
	info: PromiseWrap<typeof toast.info>
	success: PromiseWrap<typeof toast.success>
	warning: PromiseWrap<typeof toast.warning>
	error: PromiseWrap<typeof toast.error>
}

export interface IUiWorker {
	render: (view: IComponent<ListSchema.List | FormSchema.Form>) => Promise<void>
	setScrollLoading: (loading: boolean) => Promise<void>
	setSearchTerm: (term: string) => Promise<void>
	setSearchBarPlaceholder: (placeholder: string) => Promise<void>
}

export interface IUiIframe {
	goHome: () => Promise<void>
	goBack: () => Promise<void>
	hideBackButton: () => Promise<void>
	hideMoveButton: () => Promise<void>
	hideRefreshButton: () => Promise<void>
	/**
	 * position can be "top-left" | "top-right" | "bottom-left" | "bottom-right" | CustomPosition
	 * `CustomPosition` is an object with optional `top`, `right`, `bottom`, `left` properties
	 * Each property is a number, with `rem` unit, and will be applied to css `top`, `right`, `bottom`, `left` properties
	 * @param position "top-left" | "top-right" | "bottom-left" | "bottom-right" | CustomPosition
	 * @example
	 * ```ts
	 * ui.showBackButton({ top: 2, left: 2 })
	 * ui.showBackButton('top-right')
	 * ```
	 * @returns
	 */
	showBackButton: (position?: Position) => Promise<void>
	/**
	 * position can be "top-left" | "top-right" | "bottom-left" | "bottom-right" | CustomPosition
	 * `CustomPosition` is an object with optional `top`, `right`, `bottom`, `left` properties
	 * Each property is a number, with `rem` unit, and will be applied to css `top`, `right`, `bottom`, `left` properties
	 * @param position "top-left" | "top-right" | "bottom-left" | "bottom-right" | CustomPosition
	 * @example
	 * ```ts
	 * ui.showBackButton({ top: 2, left: 2 })
	 * ui.showBackButton('top-right')
	 * ```
	 * @returns
	 */
	showMoveButton: (position?: Position) => Promise<void>
	showRefreshButton: (position?: Position) => Promise<void>
	getTheme: () => Promise<{ theme: ThemeColor; radius: Radius; lightMode: LightMode }>
	reloadPage: () => Promise<void>
	startDragging: () => Promise<void>
	toggleMaximize: () => Promise<void>
	internalToggleMaximize: () => Promise<void>
}

export interface IDb {
	add: typeof JarvisExtDB.prototype.add
	delete: typeof JarvisExtDB.prototype.delete
	search: typeof JarvisExtDB.prototype.search
	retrieveAll: typeof JarvisExtDB.prototype.retrieveAll
	retrieveAllByType: typeof JarvisExtDB.prototype.retrieveAllByType
	deleteAll: typeof JarvisExtDB.prototype.deleteAll
	update: typeof JarvisExtDB.prototype.update
}

export interface IFs {
	readDir: typeof readDir
	readFile: typeof readFile
	readTextFile: typeof readTextFile
	stat: typeof stat
	lstat: typeof lstat
	exists: typeof exists
	mkdir: typeof mkdir
	create: typeof create
	copyFile: typeof copyFile
	remove: typeof remove
	rename: typeof rename
	truncate: typeof truncate
	writeFile: typeof writeFile
	writeTextFile: typeof writeTextFile
	fileSearch: typeof fileSearch
}
