<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { SUPABASE_URL } from "@/lib/constants"
import { getDevExtensionFolder, getExtensionFolder, getServerPort } from "@kksh/api/commands"
// import { open } from "@kksh/api/ui";
import { open } from "tauri-plugin-shellx-api"
import { onMounted, ref } from "vue"

const extFolder = ref<string | null>()
const devExtFolder = ref<string | null>()
const port = ref<number>()

async function refreshFolderFetch() {
	extFolder.value = await getExtensionFolder()
	devExtFolder.value = await getDevExtensionFolder()
}

onMounted(async () => {
	refreshFolderFetch()
	port.value = await getServerPort()
})
</script>
<template>
	<div class="flex flex-col space-y-3 pr-5">
		<ul>
			<li
				class="text-muted-foreground flex cursor-pointer items-center space-x-2"
				@click="extFolder && open(extFolder)"
			>
				<strong>Extension Path: </strong><span class="">{{ extFolder }}</span
				><Icon name="ion:open-outline" />
			</li>
			<li
				class="text-muted-foreground flex cursor-pointer items-center space-x-2"
				@click="devExtFolder && open(devExtFolder)"
			>
				<strong>Dev Extension Path: </strong><span>{{ devExtFolder }}</span
				><Icon name="ion:open-outline" />
			</li>

			<li
				class="text-muted-foreground flex cursor-pointer items-center space-x-2"
				@click="devExtFolder && open(`http://localhost:${port}`)"
			>
				<strong>Server Port: </strong><span>{{ port }}</span
				><Icon name="ion:open-outline" />
			</li>

			<!-- <li class="text-muted-foreground cursor-pointer flex space-x-2 items-center">
        <strong>Supabase GraphQL Endpoint</strong><span>{{ SUPABASE_URL }}</span
        ><Icon name="ion:open-outline" />
      </li> -->
		</ul>
		<Button class="" size="xs" @click="refreshFolderFetch">Refresh</Button>
	</div>
</template>
