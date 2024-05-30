import type { TauriToast } from "@/components/tauri/toast";
import { atom } from "nanostores";

export const $toasts = atom<TauriToast[]>([]);

export function enqueueToast(toast: TauriToast) {
  $toasts.set([toast, ...$toasts.get()]);
  //   return $toasts.value?.unshift(toast);
}

export function dequeueToast() {
  const last = $toasts.get().pop();
  $toasts.set($toasts.get().slice(0, -1));
  return last;
}
