<script setup lang="ts">
import * as qlink from "@/lib/db/quicklink"
import { AutoForm, AutoFormField } from "@kksh/vue/auto-form"
import { Button } from "@kksh/vue/button"
import { Separator } from "@kksh/vue/separator"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { toast } from "vue-sonner"
import { z } from "zod"

const localePath = useLocalePath()
const schema = z.object({
	name: z.string().min(1),
	link: z.string().url()
})

async function onSubmit(values: z.infer<typeof schema>) {
	return qlink
		.createQuickLinkCommand(values.name, values.link)
		.then(() => {
			toast.success("Quicklink created successfully")
			goBack()
		})
		.catch((err) => {
			toast.error(`${err}`)
		})
}

function goBack() {
	navigateTo(localePath("/"))
}
onKeyStroke("Escape", (e) => {
	if (document.activeElement?.nodeName === "INPUT") {
		const inputEle = document.activeElement as HTMLInputElement
		if (inputEle.value === "") {
			inputEle.blur()
		} else {
			inputEle.value = ""
		}
	} else {
		goBack()
	}
})
</script>

<template>
	<main class="flex h-screen flex-col items-center">
		<Button size="icon" variant="outline" @click="goBack" class="absolute left-4 top-4">
			<ArrowLeftIcon class="h-5 w-5 shrink-0" />
		</Button>
		<h1 class="w-2/3 pb-3 pt-10 text-2xl font-bold">Create Quicklink</h1>
		<AutoForm
			class="w-2/3 space-y-6"
			:schema="schema"
			@submit="onSubmit"
			:field-config="{
				name: {
					inputProps: {
						type: 'text',
						placeholder: 'Quicklink Name'
					}
				},
				link: {
					inputProps: {
						type: 'text',
						placeholder: 'https://google.com/search?q={argument}'
					}
				}
			}"
		>
			<Button type="submit">Submit</Button>
		</AutoForm>
	</main>
</template>
