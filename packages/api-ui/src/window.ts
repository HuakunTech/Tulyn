import { getCurrent } from "@tauri-apps/api/window";

export function closeWindow() {
  return getCurrent().close();
}

/**
 * Force current window to close
 * @returns Promise<void>
 */
export function destroyWindow() {
  return getCurrent().destroy();
}

export { getCurrent } from "@tauri-apps/api/window";
