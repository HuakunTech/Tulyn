import { proxy } from "@huakunshen/comlink"
import {
	clipboard,
	expose,
	Form,
	path,
	shell,
	toast,
	ui,
	updownload,
	WorkerExtension
} from "@kksh/api/ui/worker"

async function handleDownload(username: string, tweetID: string) {
	const APIResponse = await fetch(`https://api.vxtwitter.com/${username}/status/${tweetID}`).then(
		(res) => res.json()
	)
	const directURL = APIResponse.media_extended[0]?.url
	if (!directURL) return toast.error("No video found")
	const targetPath = await path.join(await path.downloadDir(), `${tweetID}.mp4`)

	await updownload.download(directURL, targetPath)
	return toast.success(
		"Downloaded",
		{
			description: `Downloaded to ${targetPath}`,
			actionLabel: "Open Folder"
		},
		async () => {
			shell.open(await path.downloadDir())
		}
	)
}

class ExtensionTemplate extends WorkerExtension {
	async onFormSubmit(value: { url: string }): Promise<void> {
		console.log("Form submitted", value)
		// value.
		const url = value.url
		const [username, tweetID] = [url.split("/")[3], url.split("/")[5]]
		handleDownload(username, tweetID)
	}
	async load() {
		const clipboardText = await clipboard.readText()
		let defaultValue = undefined
		if (
			// TODO: Improve URL validation
			clipboardText &&
			(clipboardText.includes("twitter.com") || clipboardText.includes("x.com")) &&
			clipboardText.split("/").length > 4
		) {
			defaultValue = clipboardText
		}
		const form = new Form.Form({
			key: "video-url",
			fields: [
				new Form.InputField({
					key: "url",
					label: "Tweet URL",
					default: defaultValue,
					placeholder: "Enter Tweet URL"
				})
			]
		})
		console.log("form from worker", form.toModel())

		return ui.render(form)
	}

	onSearchTermChange(term: string): Promise<void> {
		console.log("Search term changed to:", term)
		return Promise.resolve()
	}

	onItemSelected(value: string): Promise<void> {
		console.log("Item selected:", value)
		return Promise.resolve()
	}
}

expose(new ExtensionTemplate())
