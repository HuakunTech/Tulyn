<script setup lang="ts">
import { Button } from "@kksh/vue/button"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@kksh/vue/select"

const { locale, setLocale } = useI18n()
const localPath = useLocalePath()

function languageOnChange(lang: string) {
	setLocale(lang)
}
</script>
<template>
	<div class="grid grid-cols-2 items-center gap-4">
		<span class="justify-self-end">{{ $t("settings.general.language") }}</span>
		<div class="w-36">
			<Select @update:model-value="languageOnChange" :default-value="locale">
				<SelectTrigger>
					<SelectValue :placeholder="$t('selectLang')" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="zh">中文</SelectItem>
					<SelectItem value="en">English</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</div>
</template>
