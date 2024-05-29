import type { TListItem } from "jarvis-api";
import { ExtensionBase } from "./base";

export class DevExtension extends ExtensionBase {
  load(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getInitialListItems(): TListItem[] {
    throw new Error("Method not implemented.");
  }
  onSelect(item: TListItem): void {
    throw new Error("Method not implemented.");
  }
  search(searchTerm: string): TListItem[] {
    throw new Error("Method not implemented.");
  }
}
