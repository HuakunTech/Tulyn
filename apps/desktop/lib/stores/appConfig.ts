import {
  restartServer,
  setDevExtensionFolder as setDevExtensionFolderForServer
} from "@kunkun/api/commands"
import { attachConsole, debug, error, info, trace } from "@tauri-apps/plugin-log"
import { Store } from "@tauri-apps/plugin-store"
import { useColorMode } from "@vueuse/core"
import { map } from "nanostores"
import { z } from "zod"
import { allColors } from "../themes/themes"

const persistAppConfig = new Store("appConfig.bin")

export const LightMode = z.union([z.literal("light"), z.literal("dark"), z.literal("auto")])
export type LightMode = z.infer<typeof LightMode>

export const appConfigSchema = z.object({
  isInitialized: z.boolean(),
  theme: z.string(),
  radius: z.number(),
  triggerHotkey: z.string().array().nullable(),
  lightMode: LightMode,
  launchAtLogin: z.boolean(),
  showInTray: z.boolean(),
  devExtensionPath: z.string().optional(),
  devExtLoadUrl: z.boolean().default(false) // load extension page from dev server
})

export type State = z.infer<typeof appConfigSchema>

let defaultState: State = {
  isInitialized: false,
  theme: "zinc",
  radius: 0.5,
  triggerHotkey: null,
  lightMode: "auto",
  launchAtLogin: true,
  showInTray: true,
  devExtensionPath: undefined,
  devExtLoadUrl: false
}

export const $appConfig = map<State>(defaultState)

async function initAppConfig() {
  const loadedConfig = await persistAppConfig.get("config")
  // console.log("loadedConfig", loadedConfig)

  const parsedConfig = appConfigSchema.safeParse(loadedConfig)
  if (parsedConfig.success) {
    defaultState = {
      ...defaultState,
      ...parsedConfig.data
    }
  }
  $appConfig.set(defaultState)

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
    // console.log("appConfig changed", state, oldState)

    // update storage
    persistAppConfig.set("config", state)
    persistAppConfig.save()
  })
}
initAppConfig()
export function setTheme(theme: string) {
  $appConfig.setKey("theme", theme)
}

export function setRadius(radius: number) {
  $appConfig.setKey("radius", radius)
}

export function setTriggerHotkey(triggerHotkey: string[] | null) {
  $appConfig.setKey("triggerHotkey", triggerHotkey)
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

export function setDevExtensionPath(devExtensionPath: string | undefined) {
  // set this in server and restart server
  $appConfig.setKey("devExtensionPath", devExtensionPath)
  return setDevExtensionFolderForServer(devExtensionPath).then(() => {
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
