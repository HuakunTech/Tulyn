import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({ searchTerm: "" }),
  getters: {},
  actions: {},
});
