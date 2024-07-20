import path from "path"

export const NODE_ENV = process.env.NODE_ENV ?? "development"
export const isProduction = NODE_ENV === "production"
export const rootDir = isProduction ? __dirname : path.dirname(__dirname)
export const templateRoot = isProduction
  ? path.join(rootDir, "templates")
  : path.join(rootDir, "../../templates")
