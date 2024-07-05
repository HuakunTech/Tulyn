import { expose } from "@huakunshen/comlink"
import type { TListItem } from "@jarvis-plugin/models"
import { clipboard, type IWorkerExtensionBase } from "jarvis-api/ui/worker"

class SampleWorkerExt implements IWorkerExtensionBase {
  name = "sample-worker"

  onSearchTermChange(term: string): Promise<void> {
    this.count++
    return Promise.resolve()
  }
  count = 0
  load(): Promise<void> {
    console.log("SampleWorkerExt.load")
    return Promise.resolve()
  }

  default() {
    console.log("worker default method")
    return Promise.resolve(this.count.toString())
  }
}

const ext = new SampleWorkerExt()
expose(ext)

console.log("from worker")
