/**
 * This function transforms server method name to client method name
 * e.g. shellExecute -> execute, fsReadFile -> readFile
 * @param name
 */
export function transformMethodName(name: string, prefixLength: number) {
	return name.substring(prefixLength).charAt(0).toLowerCase() + name.substring(prefixLength + 1)
}
