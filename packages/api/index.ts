// import { TListItem } from "tauri-plugin-jarvis-api";
import { models } from "tauri-plugin-jarvis-api";
export { models } from "tauri-plugin-jarvis-api";
export * from "tauri-plugin-jarvis-api";

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
  setSearchResult(items: models.TListItem[]): void;
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

  onItemSelected(item: models.TListItem) {
    throw new Error("Not implemented");
  }
}
