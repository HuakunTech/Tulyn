<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CogIcon, InfoIcon, UserRoundIcon, SquareTerminalIcon, BugIcon } from "lucide-vue-next";
import { Icon } from "@iconify/vue";
import AboutTab from "src/components/settings/AboutTab.vue";
import GeneralTab from "src/components/settings/GeneralTab.vue";
import ExtensionsTab from "src/components/settings/ExtensionsTab.vue";
import DeveloperTab from "src/components/settings/DeveloperTab.vue";
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
      <!-- <TabsTrigger value="account">
        <UserRoundIcon class="h-5 w-5 mr-2" />
        Account
      </TabsTrigger> -->
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
