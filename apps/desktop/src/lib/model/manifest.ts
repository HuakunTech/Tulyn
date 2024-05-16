import { z } from "zod";

export const JarvisManifest = z.object({
  ui: z.string().optional(),
  identifier: z.string(),
});
export type JarvisManifest = z.infer<typeof JarvisManifest>;
export const PackageJson = z.object({
  name: z.string(),
  version: z.string().optional(),
  description: z.string().optional(),
  jarvis: JarvisManifest,
});
export type PackageJson = z.infer<typeof PackageJson>;
export const ExtInfo = z.object({
  name: z.string(),
  path: z.string(),
  package_json: PackageJson,
});
export type ExtInfo = z.infer<typeof ExtInfo>;
