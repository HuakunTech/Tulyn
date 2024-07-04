<script setup lang="ts">
import AboutTab from "@/components/settings/AboutTab.vue"
import DeveloperTab from "@/components/settings/DeveloperTab.vue"
import ExtensionsTab from "@/components/settings/ExtensionsTab.vue"
import GeneralTab from "@/components/settings/GeneralTab.vue"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@iconify/vue"
import { BugIcon, CogIcon, InfoIcon, SquareTerminalIcon, UserRoundIcon } from "lucide-vue-next"

definePageMeta({
  layout: "top-bar"
})
</script>
<template>
  <Tabs default-value="general" class="w-full h-full flex flex-col px-1">
    <TabsList class="grid w-full grid-cols-4 select-none">
      <TabsTrigger value="general">
        <CogIcon class="mr-2 h-5 w-5" />
        General
      </TabsTrigger>
      <TabsTrigger value="extensions">
        <Icon icon="fluent:developer-board-lightning-20-regular" class="mr-2 h-5 w-5" />
        Extensions
      </TabsTrigger>
      <TabsTrigger value="developer">
        <SquareTerminalIcon class="h-5 w-5 mr-2" />
        Developer
      </TabsTrigger>
      <TabsTrigger value="about">
        <InfoIcon class="h-5 w-5 mr-2" />
        About
      </TabsTrigger>
    </TabsList>
    <TabsContent value="general" class="grow min-h-0">
      <GeneralTab />
    </TabsContent>
    <TabsContent value="extensions" class="grow min-h-0">
      <ExtensionsTab />
    </TabsContent>
    <TabsContent value="developer" class="grow min-h-0">
      <DeveloperTab />
    </TabsContent>
    <TabsContent value="about" class="grow min-h-0">
      <AboutTab class="" />
    </TabsContent>
  </Tabs>
</template>
