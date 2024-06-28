<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ServerStatus from "./Developer/ServerStatus.vue";
import DevVars from "./Developer/DevVars.vue";
import { InfoIcon } from "lucide-vue-next";
import Installation from "@/components/settings/Developer/Installation.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
</script>
<template>
  <div class="pt-2 pb-5 max-h-full overflow-auto">
    <div class="grow container">
      <Accordion type="single" collapsible>
        <AccordionItem value="server-status">
          <AccordionTrigger>
            <span class="flex space-x-2 items-center">
              <span>Server Status</span>
              <HoverCard>
                <HoverCardTrigger><InfoIcon :size="20" /></HoverCardTrigger>
                <HoverCardContent class="w-96 ml-10">
                  The frontend of the extensions is hosted on a local HTTP server, which also routes
                  some IPC messages. This tab can be used to debug the server and verify if the
                  correct extension folders are being hosted. The status badge and folder paths are
                  updated every second.
                </HoverCardContent>
              </HoverCard>
            </span>
          </AccordionTrigger>
          <AccordionContent><ServerStatus /></AccordionContent>
        </AccordionItem>
        <AccordionItem value="ext-installation">
          <AccordionTrigger>Installation</AccordionTrigger>
          <AccordionContent><Installation /></AccordionContent>
        </AccordionItem>
        <AccordionItem value="Folders">
          <AccordionTrigger>Folders</AccordionTrigger>
          <AccordionContent><DevVars /></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>
