<script lang="ts">
  import { ModeToggle, ModeDropdown } from "$lib/components/theme";
  import { Button } from "$lib/components/ui/button";
  import Calculator from "lucide-svelte/icons/calculator";
  import Calendar from "lucide-svelte/icons/calendar";
  import CreditCard from "lucide-svelte/icons/credit-card";
  import Settings from "lucide-svelte/icons/settings";
  import Smile from "lucide-svelte/icons/smile";
  import User from "lucide-svelte/icons/user";
  import CmdkFooter from "./footer.svelte";
  import * as Command from "$lib/components/ui/command";
  import { cn } from "$lib/utils";
  import { SettingsIcon } from "lucide-svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";

  let highlighted = "";
  $: {
    console.log("highlighted:", highlighted);
  }

  let searchTerm = "";
  $: {
    console.log("search term:", searchTerm);
  }
</script>

<Command.Root
  class={cn("rounded-lg border shadow-md", $$props.class)}
  bind:value={highlighted}
>
  <Command.Input
    placeholder="Type a command or search..."
    autofocus
    bind:value={searchTerm}
  />
  <div class="grow">
    <Command.List>
      <Command.Empty>No results found.</Command.Empty>
      <Command.Group heading="Suggestions">
        <Command.Item onSelect={(v) => console.log("selected:", v)}>
          <Calendar class="mr-2 h-4 w-4" />
          <span>Calendar</span>
        </Command.Item>
        <Command.Item onSelect={(v) => console.log("selected:", v)}>
          <Smile class="mr-2 h-4 w-4" />
          <span>Search Emoji</span>
        </Command.Item>
        <Command.Item onSelect={(v) => console.log("selected:", v)}>
          <Calculator class="mr-2 h-4 w-4" />
          <span>Calculator</span>
        </Command.Item>
      </Command.Group>
      <Command.Separator />
      <Command.Group heading="Settings">
        <Command.Item onSelect={(v) => console.log("selected:", v)}>
          <User class="mr-2 h-4 w-4" />
          <span>Profile</span>
          <Command.Shortcut>⌘P</Command.Shortcut>
        </Command.Item>
        <Command.Item value="billllling">
          <CreditCard class="mr-2 h-4 w-4" />
          <span>Billing</span>
          <Command.Shortcut>⌘B</Command.Shortcut>
        </Command.Item>
        <Command.Item onSelect={(v) => console.log("selected:", v)}>
          <Settings class="mr-2 h-4 w-4" />
          <span>Settings</span>
          <Command.Shortcut>⌘S</Command.Shortcut>
        </Command.Item>
      </Command.Group>
    </Command.List>
  </div>
  <CmdkFooter>
    <SettingsIcon class="ml-2 h-4 w-4" />
    <div class="flex items-center space-x-2">
      <Button variant="ghost" size="sm">
        Open Application
        <kbd class="ml-1">↵</kbd>
      </Button>
      <Separator orientation="vertical" />
      <!-- <ActionPanel
        selectedValue={value}
        inputRef={actionInputRef}
        actionItems={[
          { label: "Open Application", value: "open" },
          { label: "Show in Finder", value: "finder" },
          { label: "Show Info in Finder", value: "info" },
          { label: "Add to Favorites", value: "favorites" },
        ]}
      ></ActionPanel> -->
    </div>
  </CmdkFooter>
</Command.Root>
