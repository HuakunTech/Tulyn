import { defineStore } from "pinia";
import { model, apps as appsAPI } from "@jarvis/api";
import { z } from "zod";

export const LightMode = z.union([z.literal("light"), z.literal("dark"), z.literal("system")]);
export type LightMode = z.infer<typeof LightMode>;

interface State {
  // searchTerm: string;
  // apps: model.apps.AppInfo[];
  // appsToDisplay: model.apps.AppInfo[];
  theme: string;
  radius: number;
  lightMode: LightMode;
  launchAtLogin: boolean;
  showInTray: boolean;
}

export const useAppConfigStore = defineStore("appConfig", {
  state: (): State => ({
    // searchTerm: "",
    // apps: [],
    // appsToDisplay: [],
    theme: "zinc",
    radius: 0.5,
    lightMode: "system",
    launchAtLogin: true,
    showInTray: true,
  }),
  getters: {
    themeClass(state) {
      return `theme-${state.theme}`;
    },
  },
  actions: {
    setTheme(theme: string) {
      this.theme = theme;
    },
    setRadius(radius: number) {
      this.radius = radius;
    },
    setLightMode(mode: LightMode) {
      const parsedMode = LightMode.parse(mode);
      this.lightMode = parsedMode; // update storage
    },
    setLaunchAtLogin(launchAtLogin: boolean) {
      this.launchAtLogin = launchAtLogin;
      // TODO
    },
    setShowInTray(showInTray: boolean) {
      this.showInTray = showInTray;
      // TODO
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
