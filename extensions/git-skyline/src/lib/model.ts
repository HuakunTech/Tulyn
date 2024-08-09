import { z } from "zod"

export const PreferencesSchema = z.object({
	transparentBackground: z.boolean().default(true),
	githubUsername: z.string(),
	year: z.number().optional(),
	enableZoom: z.boolean().default(true),
	enableAutoRotate: z.boolean().default(true),
	enableDamping: z.boolean().default(true),
	enablePanning: z.boolean().default(true),
	autoRotateSpeed: z.number().default(1)
})

export type Preferences = z.infer<typeof PreferencesSchema>
