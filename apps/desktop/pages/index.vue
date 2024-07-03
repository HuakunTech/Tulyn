<script setup lang="ts">
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-icons/vue";
</script>
<template>
  <div class="h-full">
    <Command class="rounded-lg border shadow-md h-full" @update:selected-value="(val) => console.log(val)">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList class="h-full">
        <!-- <CommandEmpty>No results found.</CommandEmpty> -->
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="Profile">
            <PersonIcon class="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="Mail">
            <EnvelopeClosedIcon class="mr-2 h-4 w-4" />
            <span>Mail</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem value="Settings">
            <GearIcon class="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <!-- <CmdPaletteFooter /> -->
    </Command>
  </div>
  <!-- <CmdDemo /> -->
</template>
