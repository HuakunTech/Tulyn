<script setup lang="ts">
import { db, JarvisExtDB } from "@kksh/api/commands"
import { constructJarvisServerAPIWithPermissions, exposeApiToWindow } from "@kksh/api/ui"
import {
  convertJarvisExtDBToServerDbAPI,
  type IDbServer,
  type IUiIframe
} from "@kksh/api/ui/iframe"
import { toast } from "vue-sonner"
import { useExtStore } from "../stores/ext"

const iframeLoaded = ref(false)
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

function onIframeLoad() {
  setTimeout(() => {
    // avoid flickering, especially on slow connections and dark mode
    iframeLoaded.value = true
  }, 200)
}
</script>
<template>
  <main class="h-screen">
    <iframe
      v-show="iframeLoaded"
      @load="onIframeLoad"
      ref="iframeRef"
      class="h-full"
      width="100%"
      heigh="100%"
      frameborder="0"
      :src="extStore.currentCustomUiExt?.url"
    />
    <FunDance v-show="!iframeLoaded" />
  </main>
</template>
