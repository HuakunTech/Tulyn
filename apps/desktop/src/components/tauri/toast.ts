import { z } from "zod";
import { window } from "@jarvis/api-ui";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { currentMonitor } from "@tauri-apps/api/window";
import { enqueueToast, $toasts } from "@/lib/stores/toast";

export const TauriToast = z.object({
  variant: z
    .union([z.literal("success"), z.literal("error"), z.literal("info"), z.literal("default")])
    .default("default"),
  duration: z.number().default(3000),
  message: z.string(),
});
export type TauriToast = z.infer<typeof TauriToast>;

export async function tauriToast(toastPayload: TauriToast) {
  const mon = await currentMonitor();
  if (!mon?.size) {
    return;
  }

  enqueueToast(toastPayload);
  console.log($toasts.get());
  
  if (window.windowLabelExists("toast")) {
    return;
  }
  const { width, height } = mon?.size;
  new WebviewWindow("toast", {
    url: "/toast",
    decorations: true,
    transparent: true,
    width: 300,
    x: width / 2 - 150,
    y: height - 100,
    alwaysOnTop: true,
  });
}
