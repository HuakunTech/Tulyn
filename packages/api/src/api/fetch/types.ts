export interface ProxyConfig {
  /**
   * The URL of the proxy server.
   */
  url: string
  /**
   * Set the `Proxy-Authorization` header using Basic auth.
   */
  basicAuth?: {
    username: string
    password: string
  }
  /**
   * A configuration for filtering out requests that shouldn't be proxied.
   * Entries are expected to be comma-separated (whitespace between entries is ignored)
   */
  noProxy?: string
}

/**
 * Configuration of a proxy that a Client should pass requests to.
 *
 * @since 2.0.0
 */
export interface Proxy {
  /**
   * Proxy all traffic to the passed URL.
   */
  all?: string | ProxyConfig
  /**
   * Proxy all HTTP traffic to the passed URL.
   */
  http?: string | ProxyConfig
  /**
   * Proxy all HTTPS traffic to the passed URL.
   */
  https?: string | ProxyConfig
}

export interface FetchSendResponse {
  status: number
  statusText: string
  headers: [[string, string]]
  url: string
  rid: number
}

/**
 * Options to configure the Rust client used to make fetch requests
 *
 * @since 2.0.0
 */
export interface ClientOptions {
  /**
   * Defines the maximum number of redirects the client should follow.
   * If set to 0, no redirects will be followed.
   */
  maxRedirections?: number
  /** Timeout in milliseconds */
  connectTimeout?: number
  /**
   * Configuration of a proxy that a Client should pass requests to.
   */
  proxy?: Proxy
}

export type FetchOptions = {
  clientConfig: {
    method: string
    url: string
    headers: [string, string][]
    data: number[] | null
    maxRedirections: number | undefined
    connectTimeout: number | undefined
    proxy: Proxy | undefined
  }
}
