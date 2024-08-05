import path from "path"
import { fileURLToPath } from "url"

export const NODE_ENV = process.env.NODE_ENV ?? "development"
export const isProduction = NODE_ENV === "production"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const REPO_ROOT = path.resolve(__dirname, "../../")

export function getRootDir() {
	return isProduction ? __dirname : path.dirname(__dirname)
}

export function getDockerFolder() {
	return isProduction ? path.join(getRootDir(), "docker") : path.join(getRootDir(), "src/docker")
}

export function getDockerEntrypoint() {
	return path.join(getDockerFolder(), "entrypoint.sh")
}
