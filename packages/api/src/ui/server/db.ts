import type { IDb, IFs, ISystem, IToast, IUiIframe, IUiWorker } from "../client"

/**
 * The server-side API for the database will not be implemented in this file/package
 * It will be constructed with JarvisExtDB in the main thread and exposed to the extension
 * We don't know extension ID here, so we can't construct the API here
 */
export interface IDbServer {
	dbAdd: IDb["add"]
	dbDelete: IDb["delete"]
	dbSearch: IDb["search"]
	dbRetrieveAll: IDb["retrieveAll"]
	dbRetrieveAllByType: IDb["retrieveAllByType"]
	dbDeleteAll: IDb["deleteAll"]
	dbUpdate: IDb["update"]
}
