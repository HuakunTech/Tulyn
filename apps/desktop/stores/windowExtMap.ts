import { getExtLabelMap, registerExtensionSpawnedProcess } from "@kksh/api/commands"
import { error } from "@tauri-apps/plugin-log"
import { defineStore } from "pinia"
import { Child } from "tauri-plugin-shellx-api"

export const useWindowExtMapStore = defineStore("window-ext-map", () => {
	const windowExtMap = ref<
		Record<
			string,
			{
				windowLabel: string
				extPath: string
				pids: number[]
			}
		>
	>({})

	function killProcesses(pids: number[]) {
		return Promise.all(
			pids.map((pid) => {
				return new Child(pid).kill().catch((err) => {
					error(`Failed to kill process ${pid}, ${err}`)
					console.error(`Failed to kill process ${pid}`, err)
				})
			})
		)
	}

	function registerExtensionWithWindow(windowLabel: string, extPath: string) {
		if (windowExtMap.value[windowLabel]) {
			killProcesses(windowExtMap.value[windowLabel].pids)
			delete windowExtMap.value[windowLabel]
		}
		if (!windowExtMap.value[windowLabel]) {
			console.log("registerExtensionWithWindow", windowLabel, extPath)
			windowExtMap.value[windowLabel] = {
				windowLabel,
				extPath,
				pids: []
			}
		}
	}

	async function unregisterExtensionFromWindow(windowLabel: string) {
		console.log("unregisterExtensionFromWindow", windowLabel)
		if (!windowExtMap.value[windowLabel]) {
			console.warn(`Window ${windowLabel} does not have an extension registered`)
		} else {
			const extLabelMap = await getExtLabelMap()
			Object.entries(extLabelMap).forEach(([label, ext]) => {
				if (label === windowLabel) {
					killProcesses(ext.processes)
				}
			})
			// killProcesses(windowExtMap.value[windowLabel].pids)
			// 	.then(() => {
			// 		delete windowExtMap.value[windowLabel]
			// 	})
			// 	.catch((err) => {
			// 		error(`Failed to unregister extension from window ${windowLabel}, ${err}`)
			// 		console.error(`Failed to unregister extension from window ${windowLabel}`, err)
			// 	})
		}
	}

	function registerProcess(windowLabel: string, pid: number) {
		registerExtensionSpawnedProcess(windowLabel, pid)
		if (!windowExtMap.value[windowLabel]) {
			throw new Error(`Window ${windowLabel} does not have an extension registered`)
		}
		windowExtMap.value[windowLabel].pids.push(pid)
	}

	return {
		windowExtMap,
		registerProcess,
		registerExtensionWithWindow,
		unregisterExtensionFromWindow
	}
})
