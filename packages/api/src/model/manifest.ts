import { z } from "zod";
import { IconType } from "./common";

export const OSPlatform = z.enum([
  "linux",
  "macos",
  // "ios",
  // "freebsd",
  // "dragonfly",
  // "netbsd",
  // "openbsd",
  // "solaris",
  // "android",
  "windows",
]);
const allPlatforms = [OSPlatform.Enum.linux, OSPlatform.Enum.macos, OSPlatform.Enum.windows];
export const TriggerCmd = z.object({
  type: z.union([z.literal("text"), z.literal("regex")]),
  value: z.string(),
});
export type TriggerCmd = z.infer<typeof TriggerCmd>;
export const TitleBarStyle = z.enum(["visible", "transparent", "overlay"]);
// JS new WebViewWindow only accepts lowercase, while manifest loaded from Rust is capitalized. I run toLowerCase() on the value before passing it to the WebViewWindow.
// This lowercase title bar style schema is used to validate and set the type so TypeScript won't complaint
// export const TitleBarStyleAllLower = z.enum(["visible", "transparent", "overlay"]);
// export type TitleBarStyleAllLower = z.infer<typeof TitleBarStyleAllLower>;
export const WindowConfig = z.object({
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  titleBarStyle: TitleBarStyle.nullable().optional(),
});
export const UiCmd = z.object({
  main: z.string().describe("HTML file to load, e.g. dist/index.html"),
  description: z.string().nullable().default("").describe("Description of the Command"),
  devMain: z
    .string()
    .describe("URL to load in development to support live reload, e.g. http://localhost:5173/"),
  name: z.string().describe("Name of the command"),
  window: WindowConfig.nullable().optional(),
  cmds: TriggerCmd.array().describe("Commands to trigger the UI"),
  platforms: OSPlatform.array()
    .nullable()
    .default(allPlatforms)
    .describe("Platforms available on. Leave empty for all platforms."),
});
export type UiCmd = z.infer<typeof UiCmd>;

export const InlineCmd = z.object({
  main: z.string(),
  name: z.string(),
  description: z.string().nullable().default("").describe("Description of the Command"),
  cmds: TriggerCmd.array(),
  platforms: OSPlatform.array()
    .nullable()
    .default(allPlatforms)
    .describe("Platforms available on. Leave empty for all platforms."),
});
export type InlineCmd = z.infer<typeof UiCmd>;

export const Icon = z.object({
  type: IconType,
  icon: z.string(),
});

export const JarvisExtManifest = z.object({
  identifier: z.string().describe("Unique identifier for the extension"),
  icon: Icon.describe("Icon for the extension"),
  demoImages: z.array(z.string()).describe("Demo images for the extension"),
  uiCmds: UiCmd.array().optional().default([]).describe("UI Commands"),
  inlineCmds: InlineCmd.array().optional().default([]).describe("Inline Commands"),
});
export type JarvisExtManifest = z.infer<typeof JarvisExtManifest>;

export const ExtPackageJson = z.object({
  name: z.string().describe("Unique name for the extension"),
  version: z.string().describe("Version of the extension"),
  description: z.string().describe("Description of the extension"),
  jarvis: JarvisExtManifest.describe("Jarvis extension manifest"),
});
export type ExtPackageJson = z.infer<typeof ExtPackageJson>;

/**
 * Extra fields for JarvisExtJson
 * e.g. path to the extension
 */
export const ExtPackageJsonExtra = ExtPackageJson.merge(
  z.object({
    extPath: z.string(),
    extFolderName: z.string(),
  }),
);
export type ExtPackageJsonExtra = z.infer<typeof ExtPackageJsonExtra>;
