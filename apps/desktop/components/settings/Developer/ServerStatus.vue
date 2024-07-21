<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast/use-toast"
import {
  getDevExtensionFolder,
  getExtensionFolder,
  restartServer,
  serverIsRunning,
  startServer,
  stopServer
} from "@akun/api/commands"
import { open } from "tauri-plugin-shellx-api"
import { onMounted, onUnmounted, ref } from "vue"
import { z } from "zod"

const { toast } = useToast()
const serverRunning = ref(false)
let interval: NodeJS.Timeout
const extFolder = ref<string | null>()
const devExtFolder = ref<string | null>()

async function refreshStatus() {
  serverRunning.value = z.boolean().parse(await serverIsRunning())
  extFolder.value = await getExtensionFolder()
  devExtFolder.value = await getDevExtensionFolder()
}

onMounted(async () => {
  refreshStatus()
  interval = setInterval(async () => {
    refreshStatus()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})

function start() {
  startServer()
    .then(() => {
      toast({
        title: "Start Server Command Sent"
      })
    })
    .catch((err) => {
      toast({
        title: "Start Server Error",
        description: err,
        variant: "destructive"
      })
    })
}

function stop() {
  stopServer()
    .then(() => {
      toast({
        title: "Stop Server Command Sent"
      })
    })
    .catch((err) => {
      toast({
        title: "Stop Server Error",
        description: err,
        variant: "destructive"
      })
    })
}

function restart() {
  restartServer()
    .then(() => {
      toast({
        title: "Restart Server Command Sent"
      })
    })
    .catch((err) => {
      toast({
        title: "Restart Server Error",
        description: err,
        variant: "destructive"
      })
    })
}
</script>
<template>
  <div class="flex items-center justify-between">
    <div class="flex space-x-2">
      <Button size="xs" @click="start">Start Server</Button>
      <Button size="xs" @click="stop">Stop Server</Button>
      <Button size="xs" @click="restart">Restart Server</Button>
    </div>
    <span class="pr-5">
      <Badge
        v-if="serverRunning"
        variant="secondary"
        class="cursor-default select-none bg-green-700 text-white"
        >On</Badge
      >
      <Badge v-else variant="destructive" class="cursor-default select-none">Off</Badge>
    </span>
  </div>
  <div class="my-2">
    <p>
      <strong>Extension Folder: </strong>
      <span class="text-muted-foreground cursor-pointer" @click="extFolder && open(extFolder)">{{
        extFolder
      }}</span>
    </p>
    <p>
      <strong>Dev Extension Folder: </strong>
      <span
        class="text-muted-foreground cursor-pointer"
        @click="devExtFolder && open(devExtFolder)"
      >
        {{ devExtFolder }}
      </span>
    </p>
  </div>
</template>
