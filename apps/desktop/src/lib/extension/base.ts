import type { TListItem } from "jarvis-api";

export abstract class ExtensionBase {
  extensionName: string;
  constructor(extName: string) {
    this.extensionName = extName;
  }

  abstract load(): Promise<void>;

  abstract getInitialListItems(): TListItem[];

  abstract onSelect(item: TListItem): Promise<void>;

  abstract search(searchTerm: string): TListItem[];
}
