import { buildWithDocker } from "@/utils"

const res = await buildWithDocker(
	// "/Users/hacker/Dev/projects/kunkun/kunkun/templates/template-ext-react"
	"/Users/hacker/Dev/projects/kunkun/kunkun/apps/create-kunkun/kunkun-extension-svelte"
)

console.log(res)
