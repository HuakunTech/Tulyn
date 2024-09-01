import { type BunPlugin } from "bun"
import { DESKTOP_SERVICE_NAME, KUNKUN_DESKTOP_APP_SERVER_PORTS } from "../constants"

export { default as prettyBytes } from "pretty-bytes"

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

export async function sendRefreshWorkerExtensionRequest() {
	console.log("Send Refresh Worker Extension Request")
	const ports = await findLocalhostKunkunPorts()
	console.log("Kunkun ports", ports)
	if (ports.length === 0) {
		console.error("Failed to find localhost kunkun ports")
		return
	} else if (ports.length > 1) {
		console.warn("Found multiple localhost kunkun ports", ports)
		console.warn("Will Refresh Every Instance")
	}
	for (const port of ports) {
		fetch(`http://localhost:${port}/refresh-worker-extension`, { method: "POST" }).catch((err) => {
			console.error("Failed to send refresh worker extension request", err)
		})
	}
}

export function kununWorkerTemplateExtensionRollupPlugin() {
	return {
		async writeBundle() {
			await sendRefreshWorkerExtensionRequest()
		}
	}
}

/**
 * This plugin will send a refresh worker extension request to the kunkun desktop app
 * so you get the same hot reload experience in the extension as you do in web apps
 *
 * If your extension takes a long time to build, the refresh request may be sent too early,
 * you can set a higher delay to ensure the build is finished before the request is sent
 * @param delay delay refresh request, in milliseconds
 * @returns
 */
export function kunkunWorkerTemplateExtensionBunPlugin(delay: number = 0): BunPlugin {
	return {
		name: "kunkun-template-extension-bun-plugin",
		async setup(build) {
			setTimeout(async () => {
				await sendRefreshWorkerExtensionRequest()
			}, delay)
		}
	}
}
