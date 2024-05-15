<script setup lang="ts">
import { Card } from "@/components/ui/card";
import {
  Startup,
  MenuBar,
  Theme,
  ThemeCustomizer,
  TriggerHotkey,
} from "@/components/settings/General";
</script>
<template>
  <Card class="py-5 flex flex-col space-y-4 border-none shadow-none">
    <Startup />
    <TriggerHotkey />
    <MenuBar />
    <Theme />
  </Card>
</template>
