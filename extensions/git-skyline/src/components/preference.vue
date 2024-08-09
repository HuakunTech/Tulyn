<script setup lang="ts">
import { setPreferences } from "@/lib/db"
import { db, notification, toast, ui } from "@kksh/api/ui/iframe"
import { AutoForm, AutoFormField } from "@kksh/vue/auto-form"
import { Button } from "@kksh/vue/button"
import { onMounted } from "vue"
import { Preferences, PreferencesSchema } from "../lib/model"

const pref = defineModel<Preferences | undefined>({ required: true })

onMounted(() => {
	document.body.style.backgroundColor = ""
	console.log(pref.value)
})

function onSubmit(values: Record<string, any>) {
	const parsed = PreferencesSchema.parse(values)
	setPreferences(parsed)
	pref.value = parsed
	console.log("Preferences saved")
	toast.success("Preferences Saved")
}
</script>

<template>
	<main class="flex flex-col items-center py-5">
		<h1 class="my-4 font-mono text-3xl">Preferences</h1>
		<AutoForm
			class="w-2/3 space-y-6"
			:schema="PreferencesSchema"
			:field-config="{
				githubUsername: {
					inputProps: {}
				},
				enableZoom: {
					inputProps: {
						value: false
					}
				}
			}"
			@submit="onSubmit"
		>
			<Button type="submit"> Submit </Button>
		</AutoForm>
	</main>
</template>
