<script setup lang="ts">
import ThemeCustomizer from "@/components/settings/General/ThemeCustomizer.vue"
import { Button } from "@kksh/vue/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@kksh/vue/dialog"
</script>
<template>
	<div class="grid grid-cols-2 gap-4">
		<div class="flex items-center justify-end">
			<span class="justify-self-end">{{ $t("theme") }}</span>
		</div>
		<Dialog>
			<DialogTrigger as-child>
				<Button variant="outline" class="w-36">{{ $t("editStyle") }}</Button>
			</DialogTrigger>
			<DialogContent class="sm:max-w-[25rem]">
				<DialogHeader>
					<DialogTitle v-show="false">Edit Theme</DialogTitle>
					<DialogDescription v-show="false"></DialogDescription>
				</DialogHeader>
				<ThemeCustomizer />
			</DialogContent>
		</Dialog>
	</div>
</template>
