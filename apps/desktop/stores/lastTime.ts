import { defineStore } from 'pinia'
import { Store } from "@tauri-apps/plugin-store"
import * as v from 'valibot'

const persistAppConfig = new Store("appConfig.bin")

export const useLastTimeStore = defineStore('kk-last-time', {
  state: () => ({
    lastCheckUpdateTime: new Date(),
  }),
  actions: {
    elapsedTime() {
      const now = new Date()
      return now.getTime() - this.lastCheckUpdateTime.getTime()
    },
    expired() {
      // check update every 24 hours
      return this.elapsedTime() > 1000 * 60 * 60 * 24
    },
    async init() {
      const lastCheckUpdateTime = await persistAppConfig.get("lastCheckUpdateTime")
      if (lastCheckUpdateTime) {
        this.lastCheckUpdateTime = new Date(v.parse(v.string(), lastCheckUpdateTime))
      } else {
        await this.update()
      }
    },
    update() {
      this.lastCheckUpdateTime = new Date()
      persistAppConfig.set("lastCheckUpdateTime", this.lastCheckUpdateTime.toISOString())
    }
  },
})