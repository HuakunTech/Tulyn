import { notification } from "jarvis-api/ui/worker"

fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
  .then((response) => response.json())
  .then((ids: string[]) => {
    return Promise.all(
      ids.slice(0, 5).map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
    )
  })
  .then((responses) => {
    return Promise.all(responses.map((response) => response.json()))
  })
  .then((items) => {
    console.log(items)
  })
;(async () => {
  notification.sendNotification("Hello from hacker news")
  // const text = await clipboard.readText()
  // console.log("Clipboard Text from hacker news", text)
  // fs.exists("foo.txt").then(console.log)
})()
