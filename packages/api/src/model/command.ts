import { z } from "zod";

// TODO: Kind of Duplicate for ListItemType, consider remove one
export const CommandType = z.enum(["system", "ui-cmd", "inline-cmd", "app"]);

export const TCommand = z.object({
  name: z.string(),
  value: z.string(),
  icon: z.string().nullable(),
  keywords: z.array(z.string()).nullable(),
  commandType: CommandType,
  function: z.function(),
  confirmRequired: z.boolean(),
});
export type TCommand = z.infer<typeof TCommand>;
