import { fetch } from "@tauri-apps/plugin-http"

/**
 * Verify if a given URL is valid by checking with head request
 * @param downloadUrl
 */
export async function verifyUrlAlive(downloadUrl: string): Promise<boolean> {
  try {
    let response = await fetch(downloadUrl, { method: "HEAD" })
    return response.ok
  } catch (e) {
    return false
  }
}
