<script setup lang="ts">
import { type Remote } from "@huakunshen/comlink"
import { WorkerExtension } from "@kksh/api/ui/worker"
import { AutoForm } from "@kksh/vue/auto-form"
import { Button } from "@kksh/vue/button"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { z } from "zod"

const localePath = useLocalePath()
const props = defineProps<{
	workerAPI: Remote<WorkerExtension>
	formViewZodSchema: z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>
	fieldConfig: Record<string, any>
}>()

onKeyStroke("Escape", () => {
	if (document.activeElement?.nodeName === "INPUT") {
		const inputEle = document.activeElement as HTMLInputElement
		if (inputEle.value.length > 0) {
			inputEle.value = ""
		} else {
			inputEle.blur()
		}
	} else {
		navigateTo(localePath("/"))
	}
})

function onSubmit(data: Record<string, any>) {
	console.log(data)
	props.workerAPI.onFormSubmit(data)
}
</script>
<template>
	<div class="flex h-screen flex-col">
		<Button
			class="absolute left-4 top-4"
			size="icon"
			variant="outline"
			@click="() => navigateTo(localePath('/'))"
		>
			<ArrowLeftIcon />
		</Button>
		<div class="mt-10 grow overflow-y-auto px-16 py-3">
			<AutoForm :schema="formViewZodSchema" @submit="onSubmit" :field-config="fieldConfig">
				<Button type="submit" class="float-right mt-3">Submit</Button>
			</AutoForm>
		</div>
		<CmdPaletteFooter />
	</div>
</template>
