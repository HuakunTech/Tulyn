import { clipboard, fs, notification } from "jarvis-api/ui/worker"


// ;(async () => {
//   notification.sendNotification("Hello from hacker news")
//   const text = await clipboard.readText()
//   console.log("Clipboard Text from hacker news", text)
//   fs.exists("foo.txt").then(console.log)
// })()

class HackerNews {
  constructor() {
    notification.sendNotification("Hello from hacker news")
    clipboard.readText().then(text => {
      console.log("Clipboard Text from hacker news", text)
    })
    fs.exists("foo.txt").then(console.log)
  }
}

