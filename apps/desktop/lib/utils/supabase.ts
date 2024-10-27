export function getFileUrl(path: string) {
	return useSupabaseClient().storage.from("extensions").getPublicUrl(path)
}
