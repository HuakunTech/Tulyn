import {
  array,
  boolean,
  enum_,
  function_,
  nullable,
  object,
  string,
  type InferOutput
} from "valibot"

// TODO: Kind of Duplicate for ListItemType, consider remove one
export enum CommandTypeEnum {
  "system",
  "ui-cmd",
  "inline-cmd",
  "app"
}
export const CommandType = enum_(CommandTypeEnum)

export const TCommand = object({
  name: string(),
  value: string(),
  icon: nullable(string()),
  keywords: nullable(array(string())),
  commandType: CommandType,
  function: function_(),
  confirmRequired: boolean()
})
export type TCommand = InferOutput<typeof TCommand>
