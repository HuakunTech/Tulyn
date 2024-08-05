import {
	expose,
	fs,
	Icon,
	IconEnum,
	List,
	os,
	path,
	shell,
	toast,
	ui,
	WorkerExtension
} from "@kksh/api/ui/worker"
import { array, boolean, flatten, object, safeParse, string, type InferOutput } from "valibot"

const Project = object({
	enabled: boolean(),
	name: string(),
	paths: array(string()),
	rootPath: string(),
	tags: array(string())
})
type Project = InferOutput<typeof Project>
const Projects = array(Project)
type Projects = InferOutput<typeof Projects>

function mapProjectToItem(project: Project): List.Item {
	return new List.Item({
		title: project.name,
		subTitle: project.rootPath,
		value: project.rootPath,
		icon: new Icon({ type: IconEnum.Iconify, value: "ri:folder-open-fill" })
	})
}

class VSCodeProjectManager extends WorkerExtension {
	async load() {
		const platform = await os.platform()
		let fileContent: string | undefined
		if (platform === "macos") {
			fileContent = await fs.readTextFile(
				"Library/Application Support/Code/User/globalStorage/alefragnani.project-manager/projects.json",
				{ baseDir: path.BaseDirectory.Home }
			)
		} else if (platform === "windows") {
			fileContent = await fs.readTextFile(
				"Code/User/globalStorage/alefragnani.project-manager/projects.json",
				{ baseDir: path.BaseDirectory.AppData }
			)
		} else if (platform === "linux") {
			fileContent = await fs.readTextFile(
				".config/Code/User/globalStorage/alefragnani.project-manager/projects.json",
				{ baseDir: path.BaseDirectory.Home }
			)
		} else {
			return toast.error(`Unsupported platform: ${platform}`).then(() => Promise.resolve())
		}
		const parseRes = safeParse(Projects, JSON.parse(fileContent))
		if (!parseRes.success) {
			return toast
				.error(`Failed to parse projects file: ${flatten<typeof Projects>(parseRes.issues)}`)
				.then(() => Promise.resolve())
		}
		const projects = parseRes.output

		const tags = projects.map((project) => project.tags).flat()
		const sections = tags.map((tag) => {
			return new List.Section({
				title: tag,
				items: projects.filter((project) => project.tags.includes(tag)).map(mapProjectToItem)
			})
		})
		sections.push(
			new List.Section({
				title: "[no tags]",
				items: projects.filter((project) => project.tags.length === 0).map(mapProjectToItem)
			})
		)

		return ui.setSearchBarPlaceholder("Search for projects...").then(() => {
			return ui.render(new List.List({ sections }))
		})
	}

	onSearchTermChange(term: string): Promise<void> {
		console.log("Search term changed to:", term)
		return Promise.resolve()
	}

	async onListItemSelected(value: string): Promise<void> {
		const platform = await os.platform()
		if (platform === "macos") {
			shell.executeBashScript(`open -a "Visual Studio Code" "${value}"`)
		} else if (platform === "windows") {
			// TODO
		} else if (platform === "linux") {
			// TODO
		} else {
			toast.error(`Unsupported platform: ${platform}).then(() => Promise.resolve()`)
		}
	}
}

expose(new VSCodeProjectManager())
