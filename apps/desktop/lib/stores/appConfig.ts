import { attachConsole, debug, error, info, trace } from "@tauri-apps/plugin-log"
import { Store } from "@tauri-apps/plugin-store"
import { useColorMode } from "@vueuse/core"
import { map } from "nanostores"
import {
  restartServer,
  setDevExtensionFolder as setDevExtensionFolderForServer
} from "tauri-plugin-jarvis-api/commands"
import { z } from "zod"
import { allColors } from "../themes/themes"

const persistAppConfig = new Store("appConfig.bin")

export const LightMode = z.union([z.literal("light"), z.literal("dark"), z.literal("auto")])
export type LightMode = z.infer<typeof LightMode>

export const appConfigSchema = z.object({
  theme: z.string(),
  radius: z.number(),
  lightMode: LightMode,
  launchAtLogin: z.boolean(),
  showInTray: z.boolean(),
  devExtentionPath: z.string().optional(),
  devExtLoadUrl: z.boolean().default(false) // load extension page from dev server
})

export type State = z.infer<typeof appConfigSchema>

const defaultState: State = {
  theme: "zinc",
  radius: 0.5,
  lightMode: "auto",
  launchAtLogin: true,
  showInTray: true,
  devExtentionPath: undefined,
  devExtLoadUrl: false
}

export const $appConfig = map<State>(defaultState)

async function initAppConfig() {
  console.log("window.__TAURI_INTERNALS__", window.__TAURI_INTERNALS__)
  setTimeout(() => {
    console.log("window.__TAURI_INTERNALS__", window.__TAURI_INTERNALS__)
  }, 1000)

  const loadedConfig = await persistAppConfig.get("config")

  const parsedConfig = appConfigSchema.safeParse(loadedConfig)
  if (parsedConfig.success) {
    defaultState.theme = parsedConfig.data.theme
    defaultState.radius = parsedConfig.data.radius
    defaultState.lightMode = parsedConfig.data.lightMode
    defaultState.launchAtLogin = parsedConfig.data.launchAtLogin
    defaultState.showInTray = parsedConfig.data.showInTray
    defaultState.devExtentionPath = parsedConfig.data.devExtentionPath
    defaultState.devExtLoadUrl = parsedConfig.data.devExtLoadUrl
  }

  $appConfig.subscribe((state, oldState) => {
    // update color mode
    if (oldState?.lightMode !== state.lightMode) {
      colorMode.value = state.lightMode
    }
    if (oldState?.theme !== state.theme) {
      document.documentElement.classList.remove(...allColors.map((color) => `theme-${color}`))
      document.documentElement.classList.add(`theme-${state.theme}`)
    }
    if (oldState?.radius !== state.radius) {
      document.documentElement.style.setProperty("--radius", `${state.radius}rem`)
    }

    // update storage
    persistAppConfig.set("config", state)
    persistAppConfig.save()
  })
}
// initAppConfig()
export function setTheme(theme: string) {
  $appConfig.setKey("theme", theme)
}

export function setRadius(radius: number) {
  $appConfig.setKey("radius", radius)
}

export function setLightMode(mode: LightMode) {
  debug(`setLightMode: ${mode}`)
  $appConfig.setKey("lightMode", LightMode.parse(mode))
}

export function setLaunchAtLogin(launchAtLogin: boolean) {
  $appConfig.setKey("launchAtLogin", launchAtLogin)
}

export function setShowInTray(showInTray: boolean) {
  $appConfig.setKey("showInTray", showInTray)
}

export function setDevExtentionPath(devExtentionPath: string | undefined) {
  // set this in server and restart server
  $appConfig.setKey("devExtentionPath", devExtentionPath)
  return setDevExtensionFolderForServer(devExtentionPath).then(() => {
    return restartServer()
  })
}

export function setDevExtLoadUrl(devExtLoadUrl: boolean) {
  $appConfig.setKey("devExtLoadUrl", devExtLoadUrl)
}

export function themeClass() {
  return `theme-${$appConfig.get().theme}`
}

const colorMode = useColorMode()
