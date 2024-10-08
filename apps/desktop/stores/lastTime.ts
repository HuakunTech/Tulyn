import { getPersistedAppConfigStore } from "~/lib/stores/appConfig"
import { defineStore } from "pinia"
import * as v from "valibot"

export const useLastTimeStore = defineStore("kk-last-time", {
	state: () => ({
		lastCheckUpdateTime: new Date()
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
			const persistAppConfig = await getPersistedAppConfigStore()
			const lastCheckUpdateTime = await persistAppConfig.get("lastCheckUpdateTime")
			if (lastCheckUpdateTime) {
				this.lastCheckUpdateTime = new Date(v.parse(v.string(), lastCheckUpdateTime))
			} else {
				await this.update()
			}
		},
		async update() {
			this.lastCheckUpdateTime = new Date()
			const persistAppConfig = await getPersistedAppConfigStore()
			persistAppConfig.set("lastCheckUpdateTime", this.lastCheckUpdateTime.toISOString())
		}
	}
})
