import type { RPCChannel } from "@hk/comlink-stdio/browser"
import {
	Action,
	app,
	Child,
	expose,
	Form,
	fs,
	Icon,
	IconEnum,
	List,
	Markdown,
	open,
	path,
	shell,
	toast,
	ui,
	WorkerExtension
} from "@kksh/api/ui/worker"

const nums = Array.from({ length: 20 }, (_, i) => i + 1)
const categories = ["Suggestion", "Advice", "Idea"]
const itemsTitle = nums.map((n) => categories.map((c) => `${c} ${n}`)).flat()
const allItems: List.Item[] = itemsTitle.map(
	(title) =>
		new List.Item({
			title,
			value: title,
			defaultAction: "Item Default Action"
		})
)

class ExtensionTemplate extends WorkerExtension {
	apiProcess?: Child

	async onBeforeGoBack() {
		console.log("onBeforeGoBack")
		// console.log(`Try killing pid: ${this.apiProcess?.pid}`)
		// await this.apiProcess?.kill()
		// console.log("apiProcess killed")
	}
	async onFormSubmit(value: Record<string, any>): Promise<void> {
		console.log("Form submitted", value)
	}

	async load() {
		ui.showLoadingBar(true)
		setTimeout(() => {
			ui.showLoadingBar(false)
		}, 2000)
		const stdioRPC = await shell.createDenoRpcChannel<
			{},
			{
				add(a: number, b: number): Promise<number>
				subtract(a: number, b: number): Promise<number>
			}
		>("$EXTENSION/deno-src/rpc.ts", [], {}, {})
		console.log("stdio", stdioRPC)
		this.apiProcess = stdioRPC.process
		const api = stdioRPC.rpcChannel.getApi()
		await api.add(1, 2).then(console.log)
		await api.subtract(1, 2).then(console.log)
		// await stdioRPC.process.kill()
		const extPath = await path.extensionDir()
		// console.log("Extension path:", extPath)
		return ui.render(
			new List.List({
				items: allItems,
				// filter: "none",
				defaultAction: "Top Default Action",
				detail: new List.ItemDetail({
					children: [
						new Markdown(`
<img src="https://github.com/huakunshen.png" />
<img src="https://github.com/huakunshen.png" />
<img src="https://github.com/huakunshen.png" />
				`)
					],
					width: 10
				})
			})
		)
	}

	async onSearchTermChange(term: string): Promise<void> {
		console.log("Search term changed to:", term)
		return ui.render(
			new List.List({
				// items: allItems.filter((item) => item.title.toLowerCase().includes(term.toLowerCase())),
				inherits: ["items", "sections"],
				// defaultAction: "Top Default Action",
				detail: new List.ItemDetail({
					children: [
						new Markdown(`
## Search results for "${term}"
<img src="https://github.com/huakunshen.png" />
<img src="https://github.com/huakunshen.png" />
<img src="https://github.com/huakunshen.png" />
						`)
					],
					width: term.length > 3 ? 70 : 30
				})
			})
		)
	}

	async onListItemSelected(value: string): Promise<void> {
		console.log("Item selected:", value)
	}

	async onActionSelected(value: string): Promise<void> {
		console.log("Action selected:", value)
	}
}

expose(new ExtensionTemplate())
