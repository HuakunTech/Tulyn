import * as _windowApis from "@tauri-apps/api/window";
import * as _webviewApis from "@tauri-apps/api/webviewWindow";

export { getCurrent, getAll, currentMonitor } from "@tauri-apps/api/window";
export { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export function closeWindow() {
  return _windowApis.getCurrent().close();
}

/**
 * Force current window to close
 * @returns Promise<void>
 */
export function destroyWindow() {
  return _windowApis.getCurrent().destroy();
}

export function windowLabelExists(label: string) {
  return _windowApis.getAll().some((w) => w.label === label);
}

export function getWindowByLabel(label: string) {
  return _windowApis.getAll().find((w) => w.label === label);
}
