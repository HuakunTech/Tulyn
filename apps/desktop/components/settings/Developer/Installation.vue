<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FolderCogIcon,
  AlertCircle,
  InfoIcon,
  ExternalLinkIcon,
  CloudDownloadIcon,
  FolderDownIcon,
} from "lucide-vue-next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { open } from "@tauri-apps/api/dialog";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

async function pickProject() {
  const selected = await open({
    directory: true,
    multiple: false,
  });
  console.log(selected);
}
</script>

<template>
  <div :class="cn('h-full', props.class)">
    <div class="container grid w-full max-w-2xl items-center gap-1.5">
      <Alert variant="destructive" class="dark:text-red-600 dark:border-red-600">
        <AlertCircle class="w-4 h-4 dark:text-red-600" />
        <AlertTitle>
          <span>Warning: Powerful Extensions, Potential Security Risks</span>

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <button class="float-right">
                <InfoIcon class="inline w-5 h-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent class="sm:max-w-[40em] overflow-auto max-h-[30em]">
              <AlertDialogHeader>
                <AlertDialogTitle class="prose dark:prose-invert">
                  <h2 class="text-red-600/90">
                    Warning: Powerful Extensions, Potential Security Risks
                  </h2>
                </AlertDialogTitle>
                <AlertDialogDescription
                  >Be Careful Installing Any Extension Here</AlertDialogDescription
                >
              </AlertDialogHeader>
              <article class="prose dark:prose-invert">
                <p>
                  This app allows you to install extensions from external sources. While these
                  extensions can provide advanced features and improve your experience (UX) and
                  developer experience (DX), they also carry significant security risks.
                </p>

                <h3>Understanding the Risks:</h3>
                <ul>
                  <li>
                    <strong>File System and System API Access:</strong> Extensions can access your
                    files and system APIs, making them powerful but potentially dangerous.
                  </li>
                  <li>
                    <strong>Limited Review Process:</strong> Extensions from the app store can be
                    reviewed by public, but there's still a chance of encountering security
                    vulnerabilities.
                  </li>
                </ul>

                <h3>Developer Settings and Untrusted Sources:</h3>
                <ul>
                  <li>
                    <strong>Developer settings</strong> allow installing extensions from anywhere,
                    like your local machine or remote URLs. This is intended only for development
                    purposes or when you absolutely trust the source.
                  </li>
                  <li>
                    <strong>Loading extensions from remote URLs</strong> grants them access to your
                    system, similar to giving a website that level of control. Since the author can
                    update the code at any time, malicious extensions could steal information or
                    take control of your system.
                    <strong>Remote URLs should only be used for development.</strong>
                  </li>
                </ul>

                <h3>Stay Safe: Trust Matters</h3>
                <p>
                  Only install extensions from reputable sources that you trust (e.g. extensions
                  written by yourself or your organization). By being cautious, you can maximize the
                  benefits and minimize the risks associated with external extensions.
                </p>
              </article>
              <AlertDialogFooter>
                <AlertDialogAction>Understood</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </AlertTitle>
      </Alert>

      <p class="text-xs">
        There are 3 options to install an extension in developer mode. Either load it from your
        local folder, download from URL or load from a remote URL directly.
      </p>
      <Label class="text-xl" for="pick">Pick Project Folder to Install</Label>
      <div class="flex justify-center">
        <Card class="w-96 h-36">
          <div class="flex justify-center items-center h-full cursor-pointer" @click="pickProject">
            <div class="flex flex-col items-center">
              <FolderCogIcon class="w-10 h-10" />
              <small class="text-xs select-none">Click or Drag and Drop</small>
            </div>
          </div>
        </Card>
      </div>

      <Label for="url" class="text-xl">
        Download URL
        <Popover>
          <PopoverTrigger as-child>
            <button class="-translate-y-0.5"><InfoIcon class="inline w-4 cursor-pointer" /></button>
          </PopoverTrigger>
          <PopoverContent class="w-96">
            <TauriLink
              class="block"
              href="https://jarvis.huakun.tech/design/extensions/installation/"
            >
              Read Docs For More Details <ExternalLinkIcon class="inline w-4 -translate-y-0.5" />
            </TauriLink>
            <div class="text-xs">
              It can be an npm package URL like
              <TauriLink class="block" href="https://registry.npmjs.org/nest-neo4j/latest"
                >https://registry.npmjs.org/nest-neo4j/latest</TauriLink
              >
              or a tarball url like
              <TauriLink
                class="block"
                href="https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz"
                >https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz</TauriLink
              >
            </div>
          </PopoverContent>
        </Popover>
      </Label>
      <div class="flex w-full items-center gap-1.5">
        <Input id="url" type="text" placeholder="Download URL" />
        <Button type="submit">Download<FolderDownIcon class="ml-2 h-4 w-4" /></Button>
      </div>

      <Label for="url" class="text-xl">
        Remote URL
        <Popover>
          <PopoverTrigger as-child>
            <button class="-translate-y-0.5"><InfoIcon class="inline w-4 cursor-pointer" /></button>
          </PopoverTrigger>
          <PopoverContent class="w-96">
            <TauriLink
              class="block"
              href="https://jarvis.huakun.tech/design/extensions/installation/"
            >
              Read Docs For More Details <ExternalLinkIcon class="inline w-4 -translate-y-0.5" />
            </TauriLink>
            <div class="text-xs">
              It can be an npm package URL like
              <TauriLink class="block" href="https://registry.npmjs.org/nest-neo4j/latest"
                >https://registry.npmjs.org/nest-neo4j/latest</TauriLink
              >
              or a tarball url like
              <TauriLink
                class="block"
                href="https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz"
                >https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz</TauriLink
              >
            </div>
          </PopoverContent>
        </Popover>
      </Label>
      <div class="flex w-full items-center gap-1.5">
        <Input id="url" type="text" placeholder="Remote URL" />
        <Button type="submit">Install<CloudDownloadIcon class="ml-2 h-4 w-4" /></Button>
      </div>
    </div>
  </div>
</template>
