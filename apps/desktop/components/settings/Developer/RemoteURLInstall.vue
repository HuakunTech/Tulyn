<script setup lang="ts">
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
import { Input } from "@kksh/vue/input"
import { Label } from "@kksh/vue/label"
import { useRemoteCmdStore } from "~/stores/remoteCmds"
import { ElMessage } from "element-plus"
import { CloudDownloadIcon } from "lucide-vue-next"
import { ref } from "vue"

const remoteCmdStore = useRemoteCmdStore()
const remoteUrl = ref("")
const name = ref("")
const open = ref(false)

function onSave() {
	try {
		const remoteExtPayload = {
			name: name.value,
			url: remoteUrl.value,
			triggerCmds: [name.value, "remote"]
		}
		console.log("remoteExtPayload", remoteExtPayload)

		remoteCmdStore
			.addRemoteExt(remoteExtPayload)
			.then(() => {
				ElMessage.success("Installed 1 Remote Command")
			})
			.catch(ElMessage.error)
		open.value = false // close dialog
	} catch (error) {
		ElMessage.error("Wrong Format")
	}
}
</script>
<template>
	<div class="flex w-full items-center gap-1.5">
		<Dialog v-model:open="open">
			<div class="flex w-full justify-center">
				<DialogTrigger as-child>
					<Button type="submit" size="sm"
						>Add A Remote URL Command<CloudDownloadIcon class="ml-2 h-4 w-4"
					/></Button>
				</DialogTrigger>
			</div>
			<DialogContent class="sm:max-w-[35rem]">
				<DialogHeader>
					<DialogTitle>Add Remote URL</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Name</Label>
						<Input id="name" v-model="name" class="col-span-3" />
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="url" class="text-right">Remote URL</Label>
						<Input id="url" v-model="remoteUrl" class="col-span-3" />
					</div>
				</div>
				<DialogFooter>
					<Button type="submit" @click="onSave">Save Changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>
