import { getWorkerApiClient } from "jarvis-api/ui"
import {
  clipboard,
  expose,
  fs,
  List,
  ListSchema,
  NodeNameEnum,
  notification,
  shell,
  toast,
  ui,
  wrap,
  type IWorkerExtensionBase
} from "jarvis-api/ui/worker"
import { array, number, object, parse, string, type InferOutput } from "valibot"

const HackerNewsItem = object({
  by: string(),
  title: string(),
  url: string(),
  score: number()
})
type HackerNewsItem = InferOutput<typeof HackerNewsItem>

function hackerNewsItemToListItem(item: HackerNewsItem): List.Item {
  return new List.Item({
    title: item.title,
    subTitle: `by: ${item.by} Vote: ${item.score}`
  })
}

class HackerNews implements IWorkerExtensionBase {
  items: HackerNewsItem[]
  listitems: List.Item[]
  constructor() {
    this.items = []
    this.listitems = []
  }
  load(): Promise<void> {
    return fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then((res) => res.json())
      .then((data) => {
        const storyIds = parse(array(number()), data)
        return Promise.all(
          storyIds
            .slice(0, 20)
            .map((id) =>
              fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) =>
                res.json()
              )
            )
        )
      })
      .then((stories) => {
        this.items = parse(array(HackerNewsItem), stories)
        this.listitems = this.items.map(hackerNewsItemToListItem)
        return ui.render(new List.List({ items: this.listitems }))
      })
      .catch((err) => {
        console.error(err)
      })
  }
  onSearchTermChange(term: string): Promise<void> {
    console.log("Search term changed", term)
    ui.render(new List.List({ items: this.listitems }))
    return Promise.resolve()
  }

  onItemSelected(value: string): Promise<void> {
    return shell.open(value)
  }
}

expose(new HackerNews())
