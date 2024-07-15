import { NodeName, NodeNameEnum } from "../../../models/constants"
import * as List from "../list"
import { type IComponent } from "./interfaces"

export class ListView implements List.List, IComponent<List.List> {
  nodeName: NodeName = NodeNameEnum.List
  sections?: List.Section[] = []
  items?: List.Item[] = []

  constructor(model: List.List) {
    this.nodeName = model.nodeName
    this.sections = model.sections
    this.items = model.items
  }

  toModel(): List.List {
    return {
      nodeName: this.nodeName,
      sections: this.sections,
      items: this.items
    }
  }

  setItems(items: List.Item[]) {
    this.items = items
  }

  setSections(sections: List.Section[]) {
    this.sections = sections
  }
}
