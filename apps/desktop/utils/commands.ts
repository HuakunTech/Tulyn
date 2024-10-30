import { toast } from "vue-sonner"

export function toggleDevExtensionLiveLoadMode() {
	const appConfig = useAppConfigStore()
	appConfig.setDevExtLoadUrl(!appConfig.devExtLoadUrl)
	const appStateStore = useAppStateStore()
	appStateStore.setSearchTermSync("")
	toast.success(`Dev Extension Live Load Mode toggled to: ${appConfig.devExtLoadUrl}`)
}

export function onBackHome() {
	navigateTo("/")
}
