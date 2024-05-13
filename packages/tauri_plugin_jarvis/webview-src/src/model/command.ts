import { z } from "zod";

// export const CommandType = z.union([z.literal("system"), z.literal("custom")]);
export const CommandType = z.enum(["system", "custom"]);

export const TCommand = z.object({
  name: z.string(),
  value: z.string(),
  icon: z.string().nullable(),
  keywords: z.array(z.string()).nullable(),
  commandType: CommandType,
  function: z.function(),
});
export type TCommand = z.infer<typeof TCommand>;
