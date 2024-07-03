import { expose, windowEndpoint, wrap, type Endpoint, type Remote } from '@huakunshen/comlink'

/**
 *
 * @param targetWindow for example: window.parent if you want to call functions from parent window within an iframe
 * @returns
 */
export function getWindowApiClient<API>(targetWindow: Window): Remote<API> {
  return wrap<API>(windowEndpoint(targetWindow))
}

/**
 *
 */
export function getWorkerApiClient<API>(): Remote<API> {
  return wrap<API>(self as Endpoint)
}

/**
 * @param win for example: iframe.contentWindow
 * @param api API Implementation
 * @returns
 */
export function exposeApiToWindow<API>(win: Window, api: API) {
  return expose(api, windowEndpoint(win))
}

export function exposeApiToWorker<API>(worker: Worker, api: API) {
  return expose(api, worker)
}
