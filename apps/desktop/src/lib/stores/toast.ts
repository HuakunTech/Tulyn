import type { TauriToast } from "@/components/tauri/toast";
import { atom } from "nanostores";

export const $toasts = atom<TauriToast[]>([]);

export function enqueueToast(toast: TauriToast) {
  return $toasts.value?.unshift(toast);
}

export function dequeueToast() {
  return $toasts.value?.pop();
}
