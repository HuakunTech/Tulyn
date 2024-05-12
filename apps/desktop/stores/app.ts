import { defineStore } from "pinia";
import { model, apps } from "@jarvis/api";

interface State {
  searchTerm: string;
  apps: model.apps.AppInfo[];
  appsToDisplay: model.apps.AppInfo[];
}

export const useAppStore = defineStore("app", {
  state: (): State => ({ searchTerm: "", apps: [], appsToDisplay: []}),
  getters: {},
  actions: {
    async fetchApps() {
      this.apps = await await apps.getAllApps();
    },
    async searchApps(searchTerm: string) {
      return this.apps.filter((app) =>
        app.name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()),
      );
    },
  },
});
