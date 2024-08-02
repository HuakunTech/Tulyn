<script setup lang="ts">
import { cn } from "@/lib/utils"
import { IconEnum, IconType, Icon as TIcon } from "@kksh/api/models"
import { Button } from "@kksh/vue/button"
import type { HTMLAttributes } from "vue"

const props = defineProps<{ icon: TIcon; class?: HTMLAttributes["class"] }>()
</script>
<template>
	<NuxtImg
		loading="lazy"
		:class="cn('', props.class)"
		v-if="icon.type === IconEnum.RemoteUrl"
		:src="icon.value"
		alt=""
	/>
	<Icon
		v-else-if="icon.type === IconEnum.Iconify"
		:name="icon.value"
		:class="cn('', props.class)"
	/>
	<NuxtImg
		loading="lazy"
		v-else-if="icon.type === IconEnum.Base64PNG"
		:src="`data:image/png;base64, ${icon.value}`"
		alt=""
	/>
	<Button
		v-else-if="icon.type === IconEnum.Text"
		:class="cn('shrink-0 text-center', props.class)"
		size="icon"
		>{{ icon.value }}</Button
	>
	<span v-else-if="icon.type === IconEnum.Svg" v-html="icon.value" />
	<Icon v-else name="mingcute:appstore-fill" :class="cn('', props.class)" />
</template>
