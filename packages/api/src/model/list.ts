import { z } from "zod";
import { IconType } from "./common";

export const ListItemType = z.enum([
  "Remote Command",
  "Command",
  "UI Command",
  "Inline Command",
  "System Command",
  "Application",
]);
export type ListItemType = z.infer<typeof ListItemType>;

export const IconSchema = z.object({
  value: z.string(),
  type: IconType,
});
export type IconSchema = z.infer<typeof IconSchema>;
export const TListItem = z.object({
  title: z.string(),
  value: z.string(),
  description: z.string(),
  type: ListItemType,
  flags: z
    .object({
      isDev: z.boolean().optional().default(false),
    })
    .optional()
    .default({}),
  icon: IconSchema.nullable(),
  keywords: z.array(z.string()).optional().default([]),
  identityFilter: z.boolean().optional().default(false),
});
export type TListItem = z.infer<typeof TListItem>;
export const TListGroup = z.object({
  title: z.string(),
  type: z.string(),
  identifier: z.string(),
  icon: IconSchema.optional(),
  items: z.array(TListItem),
  flags: z.object({
    isDev: z.boolean().optional().default(false),
  }),
});
export type TListGroup = z.infer<typeof TListGroup>;
// export const TList = z.array(TListGroup);
// export type TList = z.infer<typeof TList>;
