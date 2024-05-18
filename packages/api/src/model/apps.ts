import { z } from "zod";

export const AppInfo = z.object({
  name: z.string(),
  icon_path: z.string().nullable(),
  app_path_exe: z.string().nullable(),
  app_desktop_path: z.string(),
});
export type AppInfo = z.infer<typeof AppInfo>;
