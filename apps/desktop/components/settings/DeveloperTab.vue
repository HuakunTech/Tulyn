<script setup lang="ts">
import Installation from "@/components/settings/Developer/Installation.vue"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@kksh/vue/accordion"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kksh/vue/hover-card"
import { InfoIcon } from "lucide-vue-next"
import DevVars from "./Developer/DevVars.vue"
import ServerStatus from "./Developer/ServerStatus.vue"
</script>
<template>
	<div class="max-h-full overflow-auto pb-5 pt-2">
		<div class="container grow">
			<Accordion type="single" collapsible>
				<AccordionItem value="server-status">
					<AccordionTrigger>
						<span class="flex items-center space-x-2">
							<span>Server Status</span>
							<HoverCard>
								<HoverCardTrigger><InfoIcon :size="20" /></HoverCardTrigger>
								<HoverCardContent class="ml-10 w-96">
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
					<AccordionTrigger>Dev Variables</AccordionTrigger>
					<AccordionContent><DevVars /></AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</template>
