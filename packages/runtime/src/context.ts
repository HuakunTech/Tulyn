import {
  BaseJarvisExtension,
  TListItem,
  type IAppsAPI,
  type IClipboardAPI,
  type IJarvisAPIContext
} from "@kunkunsh/api"

export class ClipboardAPI implements IClipboardAPI {
  writeText(text: string): void {
    throw new Error("Method not implemented.")
  }
  readText(): string {
    throw new Error("Method not implemented.")
  }
}

export class AppsAPI implements IAppsAPI {
  openWithApp(path: string, app?: string) {
    switch (process.platform) {
      case "darwin":
        console.log(`open -a ${app} ${path}`)

        if (app) {
          require("child_process").exec(`open -a ${app} ${path}`)
        } else {
          require("child_process").exec(`open ${path}`)
        }
        break
      case "win32":
        throw new Error("Method not implemented.")
      case "linux":
        throw new Error("Method not implemented.")
      default:
        throw new Error(`Platform ${process.platform} is not supported`)
    }
  }
  getAllApplications(): string[] {
    throw new Error("Method not implemented.")
  }
}

/**
 * This class is an implementation of the IJarvisAPIContext interface.
 * It is used to provide the API context for Jarvis Extensions.
 * For example, helper methods like getting all applications installed
 * or open a file with a specific application are provided to extensions.
 *
 * APIs for interacting with Jarvis app are also provided. Extension can update
 * the result result list.
 */
export class APIContext implements IJarvisAPIContext {
  clipboard: IClipboardAPI
  apps: IAppsAPI

  constructor() {
    this.clipboard = new ClipboardAPI()
    this.apps = new AppsAPI()
  }

  getSearchQuery(): string {
    return "search query"
  }

  setSearchQuery(query: string): void {
    console.log(`set search query: ${query}`)
  }

  setSearchResult(items: TListItem[]): void {
    console.log(items)
  }
}
