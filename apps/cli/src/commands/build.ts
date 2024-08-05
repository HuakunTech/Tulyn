import { buildWithDockerAndValidate } from "@/utils"

export async function buildCmd(projectPath: string) {
	const buildResult = await buildWithDockerAndValidate(projectPath)
	console.log(buildResult)
}

export default buildCmd
