<script setup lang="ts">
import { cn } from "@/lib/utils"
import { Icon, IconEnum, IconType } from "jarvis-api/models"
import type { HTMLAttributes } from "vue"

const props = defineProps<{ icon: Icon; class?: HTMLAttributes["class"] }>()
</script>
<template>
  <img
    width="20"
    :class="cn('', props.class)"
    v-if="icon?.type === IconEnum.RemoteUrl"
    :src="icon?.value"
    alt=""
  />
  <Icon
    v-else-if="icon?.type === IconEnum.Iconify"
    :name="icon.value"
    :class="cn('', props.class)"
  />
  <img
    v-else-if="icon?.type === IconEnum.Base64PNG"
    :src="`data:image/png;base64, ${icon.value}`"
    alt=""
  />
  <span v-else-if="icon?.type === IconEnum.IndexNumber" :class="cn('', props.class)">{{
    icon.value
  }}</span>
  <span v-else-if="icon?.type === IconEnum.Svg" v-html="icon.value" />
  <Icon v-else name="mingcute:appstore-fill" :class="cn('', props.class)" />
</template>
