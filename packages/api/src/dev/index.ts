import os from "node:os"
import {
	DEEP_LINK_PATH_REFRESH_DEV_EXTENSION,
	DESKTOP_SERVICE_NAME,
	KUNKUN_DESKTOP_APP_SERVER_PORTS
} from "../constants"

export function checkLocalKunkunService(port: number): Promise<boolean> {
	return fetch(`http://localhost:${port}/info`)
		.then((res) => {
			if (!res.ok) {
				return false
			}
			return res.json()
		})
		.then((data) => {
			return data["service_name"] === DESKTOP_SERVICE_NAME
		})
		.catch((err) => {
			// fetch fail, i.e. server not on this port
			return false
		})
}

export async function findLocalhostKunkunPorts(): Promise<number[]> {
	const onlinePorts = []
	for (const port of KUNKUN_DESKTOP_APP_SERVER_PORTS) {
		const online = await checkLocalKunkunService(port)
		if (online) {
			onlinePorts.push(port)
		}
	}
	return onlinePorts
}

export async function refreshTemplateWorkerExtension() {
	console.log("Send Refresh Worker Extension Request")

	const platform = await os.platform()
	switch (platform) {
		case "darwin":
			await Bun.spawn(["open", `kunkun://${DEEP_LINK_PATH_REFRESH_DEV_EXTENSION}`])
			break
		case "win32":
			await Bun.spawn(["start", `kunkun://${DEEP_LINK_PATH_REFRESH_DEV_EXTENSION}`])
			break
		case "linux":
			await Bun.spawn(["xdg-open", `kunkun://${DEEP_LINK_PATH_REFRESH_DEV_EXTENSION}`])
			break
	}
}

export function kununWorkerTemplateExtensionRollupPlugin() {
	return {
		async writeBundle() {
			await refreshTemplateWorkerExtension()
		}
	}
}
