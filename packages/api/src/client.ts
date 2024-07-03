import type { IFullAPI } from './api/server-types'
import { getWindowApiClient, getWorkerApiClient } from './comlink'

export const hasWindow = typeof window !== 'undefined'
export const isInWorker = !hasWindow
export const isInIframe = hasWindow && window !== window.parent
export const isMain = !isInWorker && !isInIframe && window === window.parent
export const workerApi = getWorkerApiClient<IFullAPI>()
/**
 * `defaultClientAPI` is auto selected depending on the environment.
 */
export const defaultClientAPI = isInIframe ? getWindowApiClient<IFullAPI>(window.parent) : workerApi
