<script setup lang="ts">
import { CaretSortIcon } from "@radix-icons/vue"
import { useColorMode, useDark } from "@vueuse/core"
import { CameraIcon } from "lucide-vue-next"

const isDark = useDark()
const colorMode = useColorMode()

const count = useCounterStore()
</script>
<template>
	<div>
		<CameraIcon />
		<CaretSortIcon />
		<!-- <BaseUIModeToggle /> -->
		<ShadcnButton>ShadcnButton</ShadcnButton>
		<span>{{ count.count }}</span>
		<ShadcnButton @click="count.increment()">Inc</ShadcnButton>
	</div>
</template>
