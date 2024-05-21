<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { clipboard } from "@jarvis/api-ui";
  import { onMount } from "svelte";
  import * as jose from "jose";
  import * as Resizable from "$lib/components/ui/resizable/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { JwtToken, jwtIsValid, splitJwt } from "@/jwt";

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
    pasteJwt()
  });

  function pasteJwt() {
    clipboard.readText().then((text) => {
      if (jwtIsValid(text)) {
        jwtToken = JwtToken.parse(splitJwt(text));
      }
    });
  }
</script>

<div class="h-screen py-2 px-1">
  <Resizable.PaneGroup direction="horizontal" class="w-full h-full rounded-lg">
    <Resizable.Pane defaultSize={50}>
      <div class="w-full gap-1.5 h-full px-3 flex flex-col">
        <Label for="message" class="text-lg">JWT Token</Label>
        <div class="grow">
          <span class="text-red-400 whitespace-pre-wrap text-wrap break-words box-border"
            >{jwtToken.header}</span
          >
          <span>.</span>
          <span class="text-purple-400 whitespace-pre-wrap text-wrap break-words box-border"
            >{jwtToken.payload}</span
          >
          <span>.</span>
          <span class=" text-cyan-400 whitespace-pre-wrap text-wrap break-words box-border"
            >{jwtToken.signature}</span
          >
        </div>
        <Button class="" on:click={pasteJwt}>Paste JWT</Button>

        <!-- <Textarea placeholder="Type your token here." id="token" class="h-full mt-2" /> -->
      </div>
    </Resizable.Pane>
    <Resizable.Handle />
    <Resizable.Pane defaultSize={50} class="px-4">
      <Label for="message"
        >HEADER: <span class="text-muted-foreground">Algorithm & Token Type</span></Label
      >
      <pre class="text-red-400">{JSON.stringify(header, null, 2)}</pre>
      <Label for="message">PAYLOAD: <span class="text-muted-foreground">DATA</span></Label>
      <pre class=" text-purple-400">{JSON.stringify(payload, null, 2)}</pre>
    </Resizable.Pane>
    <!-- <Resizable.Pane defaultSize={50}>
      <Resizable.PaneGroup direction="vertical">
        <Resizable.Pane defaultSize={25}>
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </Resizable.Pane>
        <Resizable.Handle />
        <Resizable.Pane defaultSize={75}>
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Three</span>
          </div>
        </Resizable.Pane>
      </Resizable.PaneGroup>
    </Resizable.Pane> -->
  </Resizable.PaneGroup>
</div>
