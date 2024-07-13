import { getWorkerApiClient } from "jarvis-api/ui"
import {
  clipboard,
  expose,
  fs,
  ListView,
  notification,
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
  url: string()
})
type HackerNewsItem = InferOutput<typeof HackerNewsItem>

function hackerNewsItemToListItem(item: HackerNewsItem): ListItem {
  return {
    title: item.title,
    value: item.url,
    description: item.by
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
    toast.info("Loading Hacker News")
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
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
      })
      .catch((err) => {
        console.error(err)
      })
    return Promise.resolve()
  }
  onSearchTermChange(term: string): Promise<void> {
    console.log("Search term changed", term)
    ui.render(new ListView(this.listitems))
    return Promise.resolve()
  }
}

expose(new HackerNews())
