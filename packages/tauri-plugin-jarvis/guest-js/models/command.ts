import * as v from "valibot"

// TODO: Kind of Duplicate for ListItemType, consider remove one
export enum CommandTypeEnum {
  "system",
  "ui-cmd",
  "inline-cmd",
  "app"
}
export const CommandType = v.enum(CommandTypeEnum)

export const TCommand = v.object({
  name: v.string(),
  value: v.string(),
  icon: v.nullable(v.string()),
  keywords: v.nullable(v.array(v.string())),
  commandType: CommandType,
  function: v.function(),
  confirmRequired: v.boolean()
})
export type TCommand = v.InferOutput<typeof TCommand>
