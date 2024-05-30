<script setup lang="ts">
import {
  FolderCogIcon,
  AlertCircle,
  InfoIcon,
  ExternalLinkIcon,
  CloudDownloadIcon,
  FolderDownIcon,
} from "lucide-vue-next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
</script>
<template>
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
                <strong>File System and System API Access:</strong> Extensions can access your files
                and system APIs, making them powerful but potentially dangerous.
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
                <strong>Developer settings</strong> allow installing extensions from anywhere, like
                your local machine or remote URLs. This is intended only for development purposes or
                when you absolutely trust the source.
              </li>
              <li>
                <strong>Loading extensions from remote URLs</strong> grants them access to your
                system, similar to giving a website that level of control. Since the author can
                update the code at any time, malicious extensions could steal information or take
                control of your system.
                <strong>Remote URLs should only be used for development.</strong>
              </li>
            </ul>

            <h3>Stay Safe: Trust Matters</h3>
            <p>
              Only install extensions from reputable sources that you trust (e.g. extensions written
              by yourself or your organization). By being cautious, you can maximize the benefits
              and minimize the risks associated with external extensions.
            </p>
          </article>
          <AlertDialogFooter>
            <AlertDialogAction>Understood</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertTitle>
  </Alert>
</template>
