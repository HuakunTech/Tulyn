<script setup lang="ts">
import { db } from "@kksh/api/commands"
import { Button } from "@kksh/vue/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@kksh/vue/dialog"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@kksh/vue/table"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { join } from "@tauri-apps/api/path"
import { exists } from "@tauri-apps/plugin-fs"
import { loadExtensionManifestFromDisk } from "~/lib/commands/extensions"
import { open } from "tauri-plugin-shellx-api"
import { toast } from "vue-sonner"

const isDialogOpen = ref(false)
const errorMsg = ref<string | undefined>(undefined)
function onBack() {
	navigateTo("/")
}

type Result = {
	identifier: string
	path: string
	error?: string
}

const results = ref<Result[]>([])
const sortedResults = computed(() => {
	return results.value.sort((a, b) => {
		return a.error ? -1 : 1
	})
})

onKeyStroke("Escape", (e) => {
	// e.preventDefault()
	if (!isDialogOpen.value) {
		onBack()
	}
})

async function check() {
	results.value = []
	const tmpResults = []
	const extensions = await await db.getAllExtensions()
	for (const ext of extensions) {
		if (!ext.path) continue
		const _exists = await exists(ext.path)
		let error: string | undefined = undefined
		if (!_exists) {
			error = `Extension path (${ext.path}) does not exist`
		}
		const pkgJsonPath = await join(ext.path, "package.json")
		const _pkgJsonExists = await exists(pkgJsonPath)
		if (!_pkgJsonExists) {
			error = `Extension package.json (${pkgJsonPath}) does not exist`
		}
		try {
			const manifest = await loadExtensionManifestFromDisk(pkgJsonPath)
		} catch (err: any) {
			error = `Failed to load manifest from ${pkgJsonPath}: ${err.message}`
		}

		tmpResults.push({
			identifier: ext.identifier,
			path: ext.path,
			error
		})
	}
	results.value = tmpResults
	const numErrors = results.value.filter((r) => r.error).length
	const toastFn = numErrors > 0 ? toast.error : toast.info
	toastFn(`${numErrors} errors found`, {
		description: numErrors > 0 ? "Click on an error to see more details" : undefined
	})
}

onMounted(async () => {
	await check()
})

function onErrorClick(errMsg?: string) {
	if (errMsg) {
		isDialogOpen.value = true
		errorMsg.value = errMsg
	} else {
		toast.info("No error message")
	}
}
</script>
<template>
	<main class="container h-screen w-screen pt-10">
		<Button variant="outline" size="icon" class="absolute left-3 top-3 z-50" @click="onBack">
			<ArrowLeftIcon />
		</Button>
		<Button @click="check" size="sm">Check</Button>
		<Dialog v-model:open="isDialogOpen">
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Error Message</DialogTitle>
					<DialogDescription>
						{{ errorMsg }}
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead class="w-[100px]">Identifier</TableHead>
					<TableHead>Path</TableHead>
					<TableHead>Error</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="(row, idx) in sortedResults" :key="idx">
					<TableCell class="font-medium">
						<pre>{{ row.identifier }}</pre>
					</TableCell>
					<TableCell>
						<pre class="cursor-pointer text-wrap" @click="open(row.path)">{{ row.path }}</pre>
					</TableCell>
					<TableCell class="text-right">
						<button @click="onErrorClick(row.error)">
							{{ row.error ? "⚠️" : "✅" }}
						</button>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</main>
</template>
