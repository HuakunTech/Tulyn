<script setup lang="ts">
import { db, JarvisExtDB } from "@kunkunsh/api/commands"
import { constructJarvisServerAPIWithPermissions, exposeApiToWindow } from "@kunkunsh/api/ui"
import {
  convertJarvisExtDBToServerDbAPI,
  expose,
  type IDbServer,
  type IUiIframe
} from "@kunkunsh/api/ui/iframe"
import { toast } from "vue-sonner"
import { useExtStore } from "../stores/ext"

const iframeRef = ref<HTMLIFrameElement | null>(null)
const extStore = useExtStore()
const iframeUiAPI: IUiIframe = {
  goHome: function () {
    navigateTo("/")
    return Promise.resolve()
  },
  goBack: function () {
    history.back()
    return Promise.resolve()
  }
}

onMounted(async () => {
  // navigateTo("/")
  if (!extStore.currentCustomUiExt) {
    return navigateTo("/")
  }
  const currentCustomUiExt = extStore.currentCustomUiExt
  const extInfoInDB = await db.getExtensionByIdentifier(
    currentCustomUiExt.manifest.kunkun.identifier
  )
  if (!extInfoInDB) {
    toast.error("Unexpected Error", {
      description: `Worker extension ${currentCustomUiExt.manifest.kunkun.identifier} not found in database. Run Troubleshooter.`
    })
    return navigateTo("/")
  }
  const dbAPI = new db.JarvisExtDB(extInfoInDB.extId)
  const extDBApi: IDbServer = convertJarvisExtDBToServerDbAPI(dbAPI)
  if (iframeRef.value && iframeRef.value.contentWindow) {
    exposeApiToWindow(iframeRef.value.contentWindow as Window, {
      ...constructJarvisServerAPIWithPermissions(currentCustomUiExt.manifest.kunkun.permissions),
      ...iframeUiAPI,
      ...extDBApi
    })
  }
})
</script>
<template>
  <main class="h-screen">
    <!-- <Button @click="iframeUiAPI.goHome()">Back</Button> -->
    <iframe
      ref="iframeRef"
      class="h-full"
      :src="extStore.currentCustomUiExt?.url"
      width="100%"
      heigh="100%"
      frameborder="0"
    ></iframe>
  </main>
</template>
