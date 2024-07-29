import path from "path"

export function getRepoRoot(): string {
	return path.resolve(__dirname, "../..")
}

export function getTemplatesDir(): string {
	return path.resolve(getRepoRoot(), "templates")
}

export function getExtensionsDir(): string {
	return path.resolve(getRepoRoot(), "extensions")
}
