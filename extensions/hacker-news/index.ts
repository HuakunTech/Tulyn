import { getWorkerApiClient } from "jarvis-api/ui"
import {
  clipboard,
  expose,
  fs,
  ListView,
  notification,
  shell,
  toast,
  ui,
  wrap,
  type IUITemplate,
  type IWorkerExtensionBase
} from "jarvis-api/ui/worker"
import type { ListItem } from "node_modules/jarvis-api/dist/ui/worker/types"
import { array, number, object, parse, string, type InferOutput } from "valibot"

const HackerNewsItem = object({
  by: string(),
  title: string(),
  url: string(),
  score: number()
})
type HackerNewsItem = InferOutput<typeof HackerNewsItem>

function hackerNewsItemToListItem(item: HackerNewsItem): ListItem {
  return {
    title: item.title,
    value: item.url,
    description: `by: ${item.by} Vote: ${item.score}`
  }
}

class HackerNews implements IWorkerExtensionBase {
  items: HackerNewsItem[]
  listitems: ListItem[]
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
        return ui.render(new ListView(this.listitems))
      })
      .catch((err) => {
        console.error(err)
      })
  }
  onSearchTermChange(term: string): Promise<void> {
    console.log("Search term changed", term)
    ui.render(new ListView(this.listitems))
    return Promise.resolve()
  }

  onItemSelected(value: string): Promise<void> {
    return shell.open(value)
  }
}

expose(new HackerNews())
