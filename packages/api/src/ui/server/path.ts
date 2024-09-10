import { constructPathApi as constructTauriPathApi } from "tauri-api-adapter"
import type { IPath } from "../client"

/**
 * Return type omits BaseDirectory because it's only used on client side
 * @param extPath absolute path to the extension
 * @returns
 */
export function constructPathApi(extPath: string): Omit<IPath, "BaseDirectory"> {
	return {
		...constructTauriPathApi(),
		extensionDir: () => Promise.resolve(extPath)
	}
}
