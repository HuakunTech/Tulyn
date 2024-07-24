import { constructJarvisServerAPIWithPermissions, exposeApiToWorker, fs } from "@kksh/api/ui"

export const useDevWorkerExt = () => {
  onMounted(async () => {
    // const worker = new SampleWorker()
    const serverAPI = constructJarvisServerAPIWithPermissions([
      "clipboard:read-text",
      "notification:all",
      "fs:exists"
    ])
    // exposeApiToWorker(worker, serverAPI)
    // const workerAPI = wrap<IWorkerExtension>(worker)
    // await workerAPI.load()
    // console.log("default()", await workerAPI.default())
    const workerScript = await fs.readTextFile(
      "/Users/hacker/Dev/projects/Jarvis/extensions/hacker-news/dist/index.js"
    )

    const worker2 = new Worker(
      URL.createObjectURL(new Blob([workerScript], { type: "application/javascript" }))
    )
    exposeApiToWorker(worker2, serverAPI)
  })
}
