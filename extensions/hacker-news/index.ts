import { IconEnum } from "@kksh/api/models"
import {
	Action,
	dialog,
	event,
	expose,
	Icon,
	List,
	log,
	Markdown,
	network,
	notification,
	updownload,
	open,
	os,
	path,
	shell,
	sysInfo,
	system,
	toast,
	ui,
	WorkerExtension
} from "@kksh/api/ui/worker"
import {
	array,
	number,
	object,
	optional,
	parse,
	safeParse,
	string,
	type InferOutput
} from "valibot"


const HackerNewsItem = object({
	by: string(),
	title: string(),
	url: optional(string()),
	score: number()
})
type HackerNewsItem = InferOutput<typeof HackerNewsItem>

function hackerNewsItemToListItem(item: HackerNewsItem, idx: number): List.Item {
	return new List.Item({
		title: item.title,
		value: item.title,
		subTitle: `${item.by}`,
		icon: new Icon({ type: IconEnum.Text, value: (idx + 1).toString() }),
		keywords: [item.by],
		accessories: [
			new List.ItemAccessory({
				icon: new Icon({ type: IconEnum.Iconify, value: "fa6-regular:circle-up" }),
				text: `${item.score}`
			})
		],
		defaultAction: "Open",
		actions: new Action.ActionPanel({
			items: [
				new Action.Action({
					title: "Open",
					icon: new Icon({ type: IconEnum.Iconify, value: "ion:open-outline" })
				})
			]
		})
	})
}

class HackerNews extends WorkerExtension {
	items: HackerNewsItem[]
	listitems: List.Item[]
	storyIds: number[]
	value?: string

	constructor() {
		super()
		this.items = []
		this.listitems = []
		this.storyIds = []
	}

	onActionSelected(actionValue: string): Promise<void> {
		switch (actionValue) {
			case "Open":
				const target = this.items.find((item) => item.title === this.value)
				if (target) {
					if (target.url) {
						return shell.open(target.url)
					}
				}
				toast.error("Item not found")
				break
			default:
				break
		}
		return Promise.resolve()
	}
	async onListScrolledToBottom(): Promise<void> {
		await ui.setScrollLoading(true)
		return Promise.all(
			this.storyIds
				.slice(this.items.length, this.items.length + 20)
				.map((id) =>
					fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json())
				)
		)
			.then((stories) => {
				const parsed = safeParse(array(HackerNewsItem), stories)
				if (parsed.issues) {
					for (const issue of parsed.issues) {
						toast.error(issue.message)
					}
					return
				}
				this.items = this.items.concat(parsed.output)
				this.listitems = this.items.map(hackerNewsItemToListItem)
				return ui.render(new List.List({ items: this.listitems }))
			})
			.then(() => ui.setScrollLoading(false))
	}
	async load(): Promise<void> {
		return ui
			.setSearchBarPlaceholder("Scroll down to load more...")
			.then(() => fetch("https://hacker-news.firebaseio.com/v0/topstories.json"))
			.then((res) => res.json())
			.then((data) => {
				const storyIds = parse(array(number()), data)
				this.storyIds = storyIds
				return Promise.all(
					this.storyIds
						.slice(0, 20)
						.map((id) =>
							fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) =>
								res.json()
							)
						)
				)
			})
			.then((stories) => {
				const parsed = safeParse(array(HackerNewsItem), stories)
				if (parsed.issues) {
					for (const issue of parsed.issues) {
						toast.error(issue.message)
					}
					return
				}
				this.items = parsed.output
				this.listitems = this.items.map(hackerNewsItemToListItem)
				return ui.render(
					new List.List({
						items: this.listitems
						// detail: new List.ItemDetail({width: 50, children: [
						//   new Markdown(`# Hacker News\n1. hello\n2. world\n\n**bold**`)
						// ]})
					})
				)
			})
			.catch((err) => {
				console.error(err)
			})
	}

	onListItemSelected(value: string): Promise<void> {
		const target = this.items.find((item) => item.title === value)
		if (target) {
			if (target.url) {
				return shell.open(target.url)
			}
		}
		toast.error("Item not found")
		return Promise.resolve()
	}
}

expose(new HackerNews())
