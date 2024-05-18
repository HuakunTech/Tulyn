import { z } from "zod";

export const TriggerCmd = z.object({
  type: z.union([z.literal("text"), z.literal("regex")]),
  label: z.string(),
});
export type TriggerCmd = z.infer<typeof TriggerCmd>;
export const JarvisExtJson = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  identifier: z.string(),
  demoImages: z.array(z.string()),
  uiCmds: z.array(
    z.object({
      main: z.string(),
      devMain: z.string(),
      cmds: TriggerCmd.array(),
    }),
  ),
  inlineCmds: z.array(
    z.object({
      main: z.string(),
      cmds: TriggerCmd.array(),
    }),
  ),
});
export type JarvisExtJson = z.infer<typeof JarvisExtJson>;
// export const JarvisManifest = z.object({
//   ui: z.string().optional(),
//   identifier: z.string(),
// });
// export type JarvisManifest = z.infer<typeof JarvisManifest>;
// export const PackageJson = z.object({
//   name: z.string(),
//   version: z.string().optional(),
//   description: z.string().optional(),
//   jarvis: JarvisManifest,
// });
// export type PackageJson = z.infer<typeof PackageJson>;
// export const ExtInfo = z.object({
//   name: z.string(),
//   path: z.string(),
//   package_json: PackageJson,
// });
// export type ExtInfo = z.infer<typeof ExtInfo>;
