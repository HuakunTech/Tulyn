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
  icon: z
    .object({
      value: z.string(),
      type: IconType,
    })
    .nullable(),
  keywords: z.array(z.string()).optional().default([]),
  identityFilter: z.boolean().optional().default(false),
});
export type TListItem = z.infer<typeof TListItem>;
export const TListGroup = z.object({
  title: z.string(),
  items: z.array(TListItem),
});
export type ListGroup = z.infer<typeof TListGroup>;
export const TList = z.array(TListGroup);
export type TList = z.infer<typeof TList>;
