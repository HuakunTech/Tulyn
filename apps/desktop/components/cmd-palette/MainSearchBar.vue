<script setup lang="ts">
import { getExtensionsFolder, HTMLElementId } from "@/lib/constants"
</script>
<template>
	<CmdPaletteCommandInput
		:id="HTMLElementId.MainSearchInput"
		ref="cmdInputRef"
		class="text-md ml-1 h-12"
		:placeholder="$t('searchBarSearchForAppsOrCmds')"
	>
		<template v-slot:end>
			<CmdPaletteSearchBarDropdown />
		</template>
	</CmdPaletteCommandInput>
</template>
