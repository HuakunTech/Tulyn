import {
	Action,
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
	async onBeforeGoBack() {
		console.log("onBeforeGoBack")
	}
	async onFormSubmit(value: Record<string, any>): Promise<void> {
		console.log("Form submitted", value)
	}
	async load() {
		// const cmd = shell.createCommand("ls", ["-l"])
		// cmd.stdout.on("data", (data) => {
		// 	console.log(data)
		// })
		// cmd.spawn()
		// const res = await cmd.execute()
		// console.log(res.stdout)
		console.log("echo $PWD", await shell.executeBashScript("echo $PWD"))
		// open.file("$EXTENSION/src/deno-script.ts")
		const desktopPath = await path.desktopDir()
		const denoCmd = shell.createDenoCommand("$EXTENSION/src/deno-script.ts", ["-i=./avatar.png", "-o=./avatar-blur.jpeg"], {
			allowEnv: ["npm_package_config_libvips", "CWD"],
			allowRead: ["$DESKTOP"],
			allowAllFfi: true,
			cwd: desktopPath
		})
		const denoRes = await denoCmd.execute()
		console.log("denoRes.stdout", denoRes.stdout)
		console.log("denoRes.stderr", denoRes.stderr)
		console.log(denoRes)

		const extPath = await path.extensionDir()
		console.log("Extension path:", extPath)
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
