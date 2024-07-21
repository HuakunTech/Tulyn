import { BaseJarvisExtension, TListItem, type IJarvisAPIContext } from "@kunkunsh/api"
import { APIContext } from "./src/context"

// const ext = new VSCodeProjectManagerExt();
// ext.onCall(new APIContext());

const vscodeExtPath = "/Users/hacker/Dev/projects/Jarvis/packages/extensions/vscode-project-manager"

const extlib = await import(vscodeExtPath)
if (!extlib.default) {
  throw new Error("No default export found in extension")
}

const ext: BaseJarvisExtension = new extlib.default(new APIContext())

ext.onSearchTermUpdate("jarvis")

const tmpItem = TListItem.parse({
  title: "Jarvis",
  value: "/Users/hacker/Dev/projects/crosscopy-dev",
  description: "",
  type: "",
  icon: null,
  keywords: []
})

ext.onItemSelected(tmpItem)
