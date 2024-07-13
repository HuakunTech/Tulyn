import { enum_, literal, union, type InferOutput } from "valibot"
import type { ListItem } from "./types"

export enum ViewTypeEnum {
  List = "List",
  Grid = "Grid",
  ListDetail = "ListDetail"
}

export const ViewType = enum_(ViewTypeEnum)

export interface IUITemplate {
  viewType: ViewTypeEnum
}

export interface IListView extends IUITemplate {
  items: ListItem[]
}
