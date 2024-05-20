import { z } from "zod";

export const IconType = z.enum(["iconify", "asset", "remote-url", "external-asset"]);
