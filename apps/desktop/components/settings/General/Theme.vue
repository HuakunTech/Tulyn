<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
</script>
<template>
  <div class="grid grid-cols-2 gap-4">
    <span class="justify-self-end">Theme</span>
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline" class="w-36">Edit Styles</Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[25rem]">
        <DialogHeader>
          <DialogTitle v-show="false">Edit Theme</DialogTitle>
          <DialogDescription v-show="false"></DialogDescription>
        </DialogHeader>
        <SettingsGeneralThemeCustomizer />
      </DialogContent>
    </Dialog>
  </div>
</template>
