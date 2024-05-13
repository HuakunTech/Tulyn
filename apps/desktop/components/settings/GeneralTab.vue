<script setup lang="ts">
import { Card } from "@/components/ui/card";
</script>
<template>
  <Card class="py-5 flex flex-col space-y-4 border-none shadow-none">
    <SettingsGeneralStartup />
    <SettingsGeneralTriggerHotkey />
    <SettingsGeneralMenuBar />
    <SettingsGeneralTheme />
  </Card>
</template>
