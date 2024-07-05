import * as v from "valibot"

export const AppInfo = v.object({
  name: v.string(),
  icon_path: v.nullable(v.string()),
  app_path_exe: v.nullable(v.string()),
  app_desktop_path: v.string()
})
export type AppInfo = v.InferOutput<typeof AppInfo>
