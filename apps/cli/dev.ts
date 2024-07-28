import { buildWithDocker } from "@/utils"

const res = await buildWithDocker(
	"/Users/hacker/Dev/projects/kunkun/kunkun/templates/template-ext-react"
)

console.log(res)
