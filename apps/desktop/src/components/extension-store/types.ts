import { z } from "zod";

export const ExtItem = z.object({
  id: z.string(),
  identifier: z.string(),
  name: z.string(),
  version: z.string(),
});

export type ExtItem = z.infer<typeof ExtItem>;
