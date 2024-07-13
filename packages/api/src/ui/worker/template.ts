import { ViewTypeEnum, type IListView, type IUITemplate } from "./interfaces"
import type { ListItem } from "./types"

export class ListView implements IListView, IUITemplate {
  viewType = ViewTypeEnum.List
  items: ListItem[] = []
  constructor(items: ListItem[]) {
    this.items = items
  }

  setItems(items: ListItem[]) {
    this.items = items
  }
}
