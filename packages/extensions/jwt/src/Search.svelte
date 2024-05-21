<script lang="ts">
  import Calendar from "lucide-svelte/icons/calendar";
  import * as jose from "jose";
  import * as Command from "$lib/components/ui/command/index.js";
  import { JwtToken, jwtIsValid, splitJwt, claimsDef } from "$lib/jwt";
  import { onMount } from "svelte";
  import { clipboard } from "@jarvis/api-ui";
  import { toast } from "svelte-sonner";
  import dayjs from "dayjs";
  import timezone from "dayjs/plugin/timezone";
  import utc from "dayjs/plugin/utc";
  import { z } from "zod";
  import { Button } from "$lib/components/ui/button";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";

  dayjs.extend(timezone);
  dayjs.extend(utc);

  let jwtToken: JwtToken = {
    header: "",
    payload: "",
    signature: "",
  };
  let fullJwtTokenStr = "";
  $: {
    if (jwtToken && jwtToken.header && jwtToken.payload && jwtToken.signature) {
      fullJwtTokenStr = `${jwtToken.header}.${jwtToken.payload}.${jwtToken.signature}`;
    }
  }
  let payload = {};
  let header = {};
  $: {
    if (jwtIsValid(fullJwtTokenStr)) {
      payload = jose.decodeJwt(fullJwtTokenStr);
      header = jose.decodeProtectedHeader(fullJwtTokenStr);
    }
  }

  onMount(async () => {
    pasteJwt();
  });

  function pasteJwt() {
    clipboard.readText().then((text) => {
      //   text =
      // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzE2MjU0MDM4fQ.YC6NH4A3Tu0CegOQu5hCVV-6QubWzSqo7QQ-dusyTYY";
      if (jwtIsValid(text)) {
        jwtToken = JwtToken.parse(splitJwt(text));
      } else {
        toast.error("Invalid JWT in Clipboard");
      }
    });
  }

  function onSelect(key: string, val: unknown) {
    // val is either string or number, safe parse it with zod
    const schema = z.union([z.string(), z.number()]);
    const parsed = schema.safeParse(val);
    if (parsed.error) {
      console.error(parsed.error);
      toast.error("Invalid Data Type");
      return;
    } else {
      clipboard.writeText(parsed.data.toString());
      toast.success("Copied To Clipboard");
    }
  }

  function displayDate(val: unknown) {
    if (typeof val === "number") {
      const date = new Date(val * 1000);
      return date;
      //   return dayjs(date).format("YYYY-MM-DD - hh:mm:ss SSS [Z] A");
    } else if (typeof val === "string") {
      const date = new Date(parseInt(val) * 1000);
      return date;
    }
  }
</script>
<Toaster />
<ModeWatcher />
<Command.Root class="w-full px-2 h-screen">
  <div class="h-8" data-tauri-drag-region />
  <Command.Input placeholder="Type a command or search..." autofocus />
  <Command.List class="h-full">
    <Command.Empty>
      No JWT found in Clipboard.
      <br />
      <Button class="mt-5" on:click={pasteJwt}>Load From Clipboard</Button>
    </Command.Empty>
    {#if Object.values(header).length > 0}
      <Command.Group heading="HEAD: ALGORITHM & TOKEN TYPE">
        {#each Object.entries(header) as [key, val]}
          <Command.Item onSelect={() => onSelect(key, val)} class="flex justify-between">
            <span class="flex items-center">
              <Calendar class="mr-2 h-4 w-4" />
              <span>{key}</span>
              <span class="text-muted-foreground ml-3">{val}</span>
            </span>
            <span class="text-muted-foreground">{claimsDef[key]}</span>
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}
    {#if Object.values(payload).length > 0}
      <Command.Group heading="PAYLOAD: DATA">
        {#each Object.entries(payload) as [key, val]}
          <Command.Item onSelect={() => onSelect(key, val)} class="flex justify-between">
            <span class="flex items-center">
              <Calendar class="mr-2 h-4 w-4" />
              <span>{key}</span>
              {#if ["iat", "exp"].includes(key)}
                <span class="text-muted-foreground ml-3">{displayDate(val)}</span>
              {:else}
                <span class="text-muted-foreground ml-3">{val}</span>
              {/if}
            </span>
            {#if claimsDef[key]}
              <span class="text-muted-foreground">{claimsDef[key]}</span>
            {/if}
          </Command.Item>
        {/each}
      </Command.Group>
    {/if}
  </Command.List>
</Command.Root>
