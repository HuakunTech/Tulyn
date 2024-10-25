export function isExtPathInDev(extPath: string, devExtPath: string) {
	return !devExtPath.startsWith(extPath)
}
