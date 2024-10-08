import { ProcessChannel } from "@hk/comlink-stdio/browser"
import { TauriShellStdio } from "@kksh/api"
import {
	Action,
	app,
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
		ui.showLoadingBar(true)
		setTimeout(() => {
			ui.showLoadingBar(false)
		}, 2000)
		const cmd = shell.createCommand("ls", ["-l"])
		cmd.stdout.on("data", (data) => {
			console.log(data)
		})
		const denoMathCmd = shell.createDenoCommand("$EXTENSION/deno-src/rpc.ts", [], {})
		const denoMathProcess = await denoMathCmd.spawn()
		const stdio = new TauriShellStdio(denoMathCmd.stdout, denoMathProcess)

		const cmd2 = shell.createDenoCommand(
			"/Users/hacker/Dev/projects/kunkun/kunkun/extensions/demo-worker-template-ext/deno-src/deno-script.ts",
			[],
			{}
		)
		await cmd2.spawn()
		const parent = new ProcessChannel<
			{},
			{
				add(a: number, b: number): Promise<number>
				subtract(a: number, b: number): Promise<number>
			}
		>(stdio, {})
		const api = parent.getApi()
		api.add(1, 2).then(console.log)
		api.subtract(1, 2).then(console.log)

		// app.language().then((lang) => {
		// 	console.log("Language:", lang)
		// })
		// console.log("echo $PWD", await shell.executeBashScript("echo $PWD"))
		// console.log(await path.extensionSupportDir())

		// open.file("$EXTENSION/src/deno-script.ts")
		// const desktopPath = await path.desktopDir()
		// const denoCmd = shell.createDenoCommand(
		// 	"$EXTENSION/deno-src/deno-script.ts",
		// 	["-i=./avatar.png", "-o=./avatar-blur.jpeg"],
		// 	{
		// 		// allowEnv: ["npm_package_config_libvips", "CWD"],
		// 		// allowRead: ["$DESKTOP"],
		// 		// allowAllFfi: true,
		// 		// cwd: desktopPath
		// 	}
		// )
		// denoCmd.stdout.on("data", (data) => {
		// 	console.log("denoCmd.stdout", data)
		// })
		// denoCmd.stderr.on("data", (data) => {
		// 	console.warn("denoCmd.stderr", data)
		// })
		// await denoCmd.spawn()
		// const denoRes = await denoCmd.execute()
		// console.log("denoRes.stdout", denoRes.stdout)
		// console.log("denoRes.stderr", denoRes.stderr)
		// console.log(denoRes)

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
