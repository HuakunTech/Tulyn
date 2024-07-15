import { hexColor, pipe, string, type InferOutput } from "valibot"

/* -------------------------------------------------------------------------- */
/*                                    Style                                   */
/* -------------------------------------------------------------------------- */
export const Color = pipe(string(), hexColor())
export type Color = InferOutput<typeof Color>
