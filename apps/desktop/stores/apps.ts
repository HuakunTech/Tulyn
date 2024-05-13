import { defineStore } from "pinia";
import { model, apps as appsAPI } from "@jarvis/api";

interface State {
  searchTerm: string;
  apps: model.apps.AppInfo[];
  appsToDisplay: model.apps.AppInfo[];
}

export const useAppsStore = defineStore("apps", {
  state: (): State => ({
    searchTerm: "",
    apps: [],
    appsToDisplay: [],
  }),
  actions: {
    async fetchApps() {
      this.apps = await await appsAPI.getAllApps();
    },
    async searchApps(searchTerm: string) {
      return this.apps.filter((app) => app.name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()));
    },
  },
});
