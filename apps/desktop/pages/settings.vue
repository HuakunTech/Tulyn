<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CogIcon,
  InfoIcon,
  UserRoundIcon,
  SquareTerminalIcon,
} from "lucide-vue-next";
import { Icon } from "@iconify/vue";
</script>

<template>
  <NuxtLayout>
    <Tabs default-value="general" class="w-full h-full flex flex-col px-4">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="general">
          <CogIcon class="mr-2 h-5 w-5" />
          General
        </TabsTrigger>
        <TabsTrigger value="extensions">
          <Icon
            icon="fluent:developer-board-lightning-20-regular"
            class="mr-2 h-5 w-5"
          />
          Extensions
        </TabsTrigger>
        <TabsTrigger value="account">
          <UserRoundIcon class="h-5 w-5 mr-2" />
          Account
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
      <TabsContent value="general" class="grow"><SettingsGeneralTab /></TabsContent>
      <TabsContent value="extensions"><SettingsExtensionsTab /></TabsContent>
      <TabsContent value="developer"><SettingsDeveloperTab /></TabsContent>
      <TabsContent value="account"></TabsContent>
      <TabsContent value="about" class="grow">
        <SettingsAboutTab class="" />
      </TabsContent>
    </Tabs>
  </NuxtLayout>
</template>
