import { z } from "zod";

export const ExtItem = z.object({
  identifier: z.string(),
  name: z.string(),
  downloads: z.number(),
  short_description: z.string(),
  long_description: z.string(),
  icon: z.string().transform((val) => JSON.parse(val)),
});

export type ExtItem = z.infer<typeof ExtItem>;
