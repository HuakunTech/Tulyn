const isProduction = process.env.KK_NODE_ENV === "production"
const baseDir = isProduction ? "extensions" : "dev-extensions"

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	basePath: `/${baseDir}/template-ext-next/out`
}

export default nextConfig
