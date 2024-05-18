import { z } from "zod";

export const TriggerCmd = z.object({
  type: z.union([z.literal("text"), z.literal("regex")]),
  value: z.string(),
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
      name: z.string(),
      cmds: TriggerCmd.array(),
    }),
  ),
  inlineCmds: z.array(
    z.object({
      main: z.string(),
      name: z.string(),
      cmds: TriggerCmd.array(),
    }),
  ),
});
export type JarvisExtJson = z.infer<typeof JarvisExtJson>;
