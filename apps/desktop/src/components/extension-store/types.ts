import { Icon } from "jarvis-api";
import { z } from "zod";

export const ExtItemParser = z.object({
  identifier: z.string(),
  name: z.string(),
  downloads: z.number(),
  short_description: z.string(),
  long_description: z.string(),
  icon: z.string().transform((val) => JSON.parse(val)),
});

export const ExtItem = ExtItemParser.merge(z.object({ icon: Icon }));

export type ExtItem = z.infer<typeof ExtItem>;
