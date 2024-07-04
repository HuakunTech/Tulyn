<script setup lang="ts">
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/vue"
import { type IconSchema } from "jarvis-api/models"
import type { HTMLAttributes } from "vue"

const props = defineProps<{ icon: IconSchema; class?: HTMLAttributes["class"] }>()
</script>
<template>
  <img
    width="20"
    :class="cn('', props.class)"
    v-if="icon?.type === 'remote-url'"
    :src="icon?.value"
    alt=""
  />
  <Icon v-else-if="icon?.type === 'iconify'" :icon="icon.value" :class="cn('', props.class)" />
  <Icon v-else icon="mingcute:appstore-fill" :class="cn('', props.class)" />
</template>
