import type { TListItem } from "./src/model";
export { TListItem } from "./src/model";

export interface IClipboardAPI {
  writeText(text: string): void;
  readText(): string;
}

export interface IAppsAPI {
  openWithApp(path: string, app?: string): void;
  getAllApplications(): string[];
}

export interface IJarvisAPIContext {
  getSearchQuery(): string;
  setSearchQuery(query: string): void;
  setSearchResult(items: TListItem[]): void;
  apps: IAppsAPI;
  clipboard: IClipboardAPI;
}

export abstract class BaseJarvisExtension {
  ctx: IJarvisAPIContext;
  constructor(ctx: IJarvisAPIContext) {
    this.ctx = ctx;
  }
  onSearchTermUpdate(searchTerm: string) {
    throw new Error("Not implemented");
  }

  onItemSelected(item: TListItem) {
    throw new Error("Not implemented");
  }
}
