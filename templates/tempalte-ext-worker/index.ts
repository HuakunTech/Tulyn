import { expose, toast, ui, WorkerExtension } from "jarvis-api/ui/worker"

class ExtensionTemplate extends WorkerExtension {
  load() {
    return toast.info("Worker Template Extension loaded").then(() => {
      return ui.setSearchBarPlaceholder("Enter a search term, and press enter to search")
    })
  }
}

expose(new ExtensionTemplate())
