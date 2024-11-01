import { getExtensionsFolder } from "@/constants"
import type { ExtPackageJsonExtra } from "@kksh/api/models"
import { derived, type Writable, type Readable, writable } from "svelte/store"
import { loadAllExtensionsFromDb } from "@kksh/extensions"

function createExtensionsStore(): Writable<ExtPackageJsonExtra[]> & {
	init: () => Promise<void>
} {
	const { subscribe, update, set } = writable<ExtPackageJsonExtra[]>([])

	function init() {
		return loadAllExtensionsFromDb().then(exts => {
			set(exts)
		})
	}

	return {
		init,
		subscribe,
		update,
		set,
	}
}

export const extensions = createExtensionsStore()



// export const devExtsStore: Readable<ExtPackageJsonExtra[]> = derived(extensions, ($extensionsStore, set) => {
// 	getExtensionsFolder().then(extFolder => {
// 		set($extensionsStore.filter((ext) => !ext.extPath.startsWith(extFolder)))
// 	})
// })
// export const prodExtsStore: Readable<ExtPackageJsonExtra[]> = derived(extensions, ($extensionsStore, set) => {
// 	getExtensionsFolder().then((extFolder) => {
// 		set($extensionsStore.filter((ext) => ext.extPath.startsWith(extFolder)))
// 	})
// })
