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

export const TListItem = z.object({
  title: z.string(),
  value: z.string(),
  description: z.string(),
  type: ListItemType,
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
