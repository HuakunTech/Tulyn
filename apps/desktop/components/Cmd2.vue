<script setup lang="ts">
import { ref } from "vue";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const open = ref(false);
const value = ref("");
</script>
<template>
  <Command>
    <CommandInput class="h-9" placeholder="Search framework..." />
    <CommandEmpty>No framework found.</CommandEmpty>
    <CommandList>
      <CommandGroup>
        <CommandItem
          v-for="framework in frameworks"
          :key="framework.value"
          :value="framework.value"
          @select="
            (ev) => {
              if (typeof ev.detail.value === 'string') {
                value = ev.detail.value;
              }
              open = false;
            }
          "
        >
          {{ framework.label }}
          <Check
            :class="
              cn(
                'ml-auto h-4 w-4',
                value === framework.value ? 'opacity-100' : 'opacity-0',
              )
            "
          />
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
