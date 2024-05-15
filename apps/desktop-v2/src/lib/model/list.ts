import { z } from "zod";

export const IconType = z.enum(["iconify", "asset", "remote-url", "external-asset"]);
export const TListItem = z.object({
  title: z.string(),
  value: z.string(),
  description: z.string(),
  type: z.string(),
  icon: z
    .object({
      value: z.string(),
      type: IconType,
    })
    .nullable(),
  keywords: z.array(z.string()).nullable(),
});
export type TListItem = z.infer<typeof TListItem>;
export const TListGroup = z.object({
  title: z.string(),
  items: z.array(TListItem),
});
export type ListGroup = z.infer<typeof TListGroup>;
export const TList = z.array(TListGroup);
export type TList = z.infer<typeof TList>;
