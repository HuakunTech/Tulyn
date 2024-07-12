<script setup lang="ts">
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import { getExtensionsFolder } from "@/lib/constants"
import { Extension } from "@/lib/extension/ext"
import { RemoteExtension } from "@/lib/extension/remoteExt"
import { $appConfig } from "@/lib/stores/appConfig"
import { Icon } from "@iconify/vue"
import { TListGroup, type TListItem } from "@jarvis/schema"
import { ElMessage, ElTable, ElTableColumn } from "element-plus"
import { Trash2Icon } from "lucide-vue-next"
import { onMounted, ref } from "vue"

const devExt = new Extension("Dev Extensions", $appConfig.get().devExtensionPath, true)
const storeExt = new Extension("Extensions", await getExtensionsFolder())
const remoteExt = new RemoteExtension()
const tableData = ref<TListGroup[]>([])

function refreshListing() {
  return Promise.all([devExt.load(), storeExt.load(), remoteExt.load()]).then(() => {
    tableData.value = [...storeExt.groups(), ...devExt.groups(), ...remoteExt.groups()]
  })
}

onMounted(() => {
  refreshListing()
})

function handleDeleteCommand(index: number, item: TListItem) {
  if (item.type === "Remote Command") {
    remoteExt
      .removeRemoteCmd(item.value)
      .then(() => {
        ElMessage.success(`Removed Remote Command: ${item.title}`)
        refreshListing()
      })
      .catch(ElMessage.error)
  }
}

function handleDeleteExtension(index: number, item: TListGroup) {
  const ext = item.flags.isDev ? devExt : storeExt
  ext
    .uninstallExt(item.identifier)
    .then(() => {
      ElMessage.success({
        message: `Deleted Extension: ${item.title}`
      })
      refreshListing()
    })
    .catch((error) => {
      ElMessage.error({ message: error })
    })
}
</script>
<template>
  <el-table :data="tableData" class="w-full" height="100%" size="small">
    <el-table-column type="expand" width="30">
      <template #default="props">
        <div m="4">
          <el-table :data="props.row.items" :border="false" size="small">
            <el-table-column width="50" />
            <el-table-column label="Command">
              <template #default="scope">
                <div class="flex items-center space-x-2">
                  <IconMultiplexer :icon="scope.row.icon" class="w-4 h-4" />
                  <span>{{ scope.row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="Type" />
            <el-table-column label="Operations">
              <template #default="scope">
                <el-button
                  v-if="scope.row.flags.isRemovable"
                  type="danger"
                  :icon="Trash2Icon"
                  circle
                  size="small"
                  @click="handleDeleteCommand(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Name">
      <template #default="scope">
        <div class="flex items-center space-x-2">
          <IconMultiplexer :icon="scope.row.icon" class="w-4 h-4" />
          <span class="">{{ scope.row.title }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Type">
      <template #default="props">
        <div class="flex space-x-2 items-center">
          <span class="font-mono">{{ props.row.type }}</span>
          <Icon
            v-if="props.row.flags.isDev"
            icon="ph:dev-to-logo-fill"
            class="inline w-5 h-6 text-green-500"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button
          v-if="scope.row.flags.isRemovable"
          type="danger"
          :icon="Trash2Icon"
          circle
          size="small"
          @click="handleDeleteExtension(scope.$index, scope.row)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
