import { expose } from "@huakunshen/comlink"
import type { TListItem } from "@jarvis-plugin/models"
import { clipboard, IWorkerExtensionBase } from "jarvis-api/ui/worker"

class SampleWorkerExt extends IWorkerExtensionBase {
  override load(): Promise<void> {
    console.log("SampleWorkerExt.load")
    return Promise.resolve()
  }
  override default() {
    console.log("worker default method")
    return clipboard
      .readText()
      .then((text) => {
        console.log(text)
        return text
      })
      .catch((err) => {
        console.error(err)
        return "error"
      })
  }
}

const ext = new SampleWorkerExt("sample-worker")
expose(ext)

console.log("from worker")
