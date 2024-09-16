<script setup lang="ts">
import { getExtensionsFolder, HTMLElementId } from "@/lib/constants"

const appState = useAppStateStore()
const quickLinkInputs = useQuickLinksStore()
</script>
<template>
	<CmdPaletteCommandInput
		:id="HTMLElementId.MainSearchInput"
		ref="cmdInputRef"
		:searchTerm="appState.searchTermSync"
		class="text-md ml-1 h-12"
		:placeholder="$t('searchBarSearchForAppsOrCmds')"
		:quickLinkInputs="quickLinkInputs.quickLinkInputs"
	>
		<template v-slot:end>
			<CmdPaletteSearchBarDropdown />
		</template>
	</CmdPaletteCommandInput>
</template>
