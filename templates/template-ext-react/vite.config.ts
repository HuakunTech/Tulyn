import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// TODO: change this to your identifier
	base: "/{{projectName}}/dist"
})
