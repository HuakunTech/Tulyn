import { z } from "zod"

export const JsonRPCParams = z.record(z.unknown())
export type JsonRPCParams = z.infer<typeof JsonRPCParams>
export const JsonRPCPayload = z.object({
  jsonrpc: z.literal("2.0"),
  method: z.string(),
  params: JsonRPCParams.optional(),
  id: z.string().or(z.number()).nullable()
})
export type JsonRPCPayload = z.infer<typeof JsonRPCPayload>

export const MethodHandler = z.object({
  method: z.string(),
  handler: z.function()
})
export type MethodHandler = z.infer<typeof MethodHandler>

export class JsonRPCServer {
  methods: Record<string, MethodHandler>

  constructor() {
    this.methods = {}
  }

  hasMethod(method: string) {
    return this.methods[method] !== undefined
  }

  addMethod(method: string, handler: MethodHandler) {
    if (this.hasMethod(method)) {
      throw new Error(`Method ${method} already exists`)
    }
    this.methods[method] = handler
  }

  removeMethod(method: string) {
    delete this.methods[method]
  }

  async handle(payload: JsonRPCPayload) {
    const parse = JsonRPCPayload.safeParse(payload)
    if (!parse.success) {
      return Promise.reject(parse.error)
    }
    const method = this.methods[payload.method]
    if (!method) {
      return Promise.reject(`Method ${payload.method} not found`)
    }
    return method.handler(parse.data.params)
  }
}

export const ClientHandler = z.function().args(JsonRPCParams)
export type ClientHandler = z.infer<typeof ClientHandler>

export class JsonRPCClient {
  handler: ClientHandler

  constructor(handler: ClientHandler) {
    this.handler = handler
  }

  request(method: string, params: Record<string, unknown> = {}, id: string | number | null = null) {
    return this.handler({ jsonrpc: "2.0", method, params, id })
  }

  notify(method: string, params: Record<string, unknown> = {}) {
    return this.handler({ jsonrpc: "2.0", method, params })
  }
}
