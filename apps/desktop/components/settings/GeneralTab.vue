<script setup lang="ts">
import { Card } from "@/components/ui/card"
import { StrikeSeparator } from "@/components/ui/separator"
import {
  Startup,
  MenuBar,
  Theme,
  ThemeCustomizer,
  TriggerHotkey,
  LoadDevUrl
} from "@/components/settings/General"
</script>
<template>
  <Card class="py-5 flex flex-col space-y-4 border-none h-full shadow-none bg-transparent">
    <Startup />
    <TriggerHotkey />
    <MenuBar />
    <Theme />
    <StrikeSeparator>
      <span class="break-normal whitespace-nowrap">Developer Setting</span>
    </StrikeSeparator>
    <LoadDevUrl />
  </Card>
</template>
