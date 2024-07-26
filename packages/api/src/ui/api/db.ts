import { getDefaultClientAPI } from "tauri-api-adapter"
import type { JarvisExtDB } from "../../commands"
import { type IDb } from "../client"
import type { IDbServer } from "../server"

const defaultClientAPI = getDefaultClientAPI<IDbServer>()
export const comlinkDb: IDb = {
	add: defaultClientAPI.dbAdd,
	delete: defaultClientAPI.dbDelete,
	search: defaultClientAPI.dbSearch,
	retrieveAll: defaultClientAPI.dbRetrieveAll,
	retrieveAllByType: defaultClientAPI.dbRetrieveAllByType,
	deleteAll: defaultClientAPI.dbDeleteAll,
	update: defaultClientAPI.dbUpdate
}
// this db API doesn't need native implementation, for native API running in the main thread, use JarvisExtDB class directly
export const db = comlinkDb

export function convertJarvisExtDBToServerDbAPI(db: JarvisExtDB): IDbServer {
	return {
		dbAdd: (data) => db.add(data),
		dbDelete: (dataId) => db.delete(dataId),
		dbSearch: (searchParams) => db.search(searchParams),
		dbRetrieveAll: (options) => db.retrieveAll(options),
		dbRetrieveAllByType: (dataType) => db.retrieveAllByType(dataType),
		dbDeleteAll: () => db.deleteAll(),
		dbUpdate: (data) => db.update(data)
	}
}
