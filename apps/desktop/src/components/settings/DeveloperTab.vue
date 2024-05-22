<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ServerStatus from "./Developer/ServerStatus.vue";
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
                <HoverCardContent>
                  The frontend of extensions are hosted from a local http server.
                  Some IPC messages are also routed through this server.
                  This tab can be used to debug server and check whether the corrected extensions folders are hosted.
                  The Status badge and folder paths are updated every 1 second.
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
      </Accordion>
    </div>
  </div>
</template>
