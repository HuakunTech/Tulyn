import { defineStore } from "pinia";
import { model, apps } from "@jarvis/api";
import { z } from "zod";

export const LightMode = z.union([z.literal("light"), z.literal("dark"), z.literal("system")]);
export type LightMode = z.infer<typeof LightMode>;

interface State {
  searchTerm: string;
  apps: model.apps.AppInfo[];
  appsToDisplay: model.apps.AppInfo[];
  theme: string;
  radius: number;
  lightMode: LightMode;
  launchAtLogin: boolean;
  showInTray: boolean;
}

export const useAppStore = defineStore("app", {
  state: (): State => ({
    searchTerm: "",
    apps: [],
    appsToDisplay: [],
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
    async fetchApps() {
      this.apps = await await apps.getAllApps();
    },
    async searchApps(searchTerm: string) {
      return this.apps.filter((app) => app.name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()));
    },
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
