<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type TListItem, TListGroup } from "jarvis-api";
import { ElMessage, ElTable, ElTableColumn } from "element-plus";
import { Icon } from "@iconify/vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { Extension } from "@/lib/extension/ext";
import { $appConfig } from "@/lib/stores/appConfig";
import { extensionsFolder } from "@/lib/constants";
import { Trash2Icon } from "lucide-vue-next";
import { RemoteExtension } from "@/lib/extension/remoteExt";

const devExt = new Extension("Dev Extensions", $appConfig.get().devExtentionPath, true);
const storeExt = new Extension("Extensions", extensionsFolder);
const remoteExt = new RemoteExtension();
const tableData = ref<TListGroup[]>([]);

function refreshListing() {
  Promise.all([devExt.load(), storeExt.load(), remoteExt.load()]).then(() => {
    tableData.value = [
      ...storeExt.groups(),
      ...devExt.groups(),
      // ...remoteExt.$listItems.get(),
    ];
  });
}

onMounted(() => {
  refreshListing();
});

function handleDelete(index: number, item: TListGroup) {
  const ext = item.flags.isDev ? devExt : storeExt;
  ext
    .uninstallExt(item.identifier)
    .then(() => {
      ElMessage.success({
        message: `Deleted Extension: ${item.title}`,
      });
      refreshListing();
    })
    .catch((error) => {
      ElMessage.error({ message: error });
    });
}
</script>
<template>
  <el-table :data="tableData" class="w-full" height="100%" size="small">
    <el-table-column type="expand" width="30">
      <template #default="props">
        <div m="4">
          <el-table :data="props.row.items" :border="false">
            <el-table-column width="30" />
            <el-table-column label="Command">
              <template #default="scope">
                <div class="flex items-center space-x-2">
                  <IconMultiplexer :icon="scope.row.icon" class="w-4 h-4" />
                  <span>{{ scope.row.title }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="Type" />
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
          type="danger"
          :icon="Trash2Icon"
          circle
          size="small"
          @click="handleDelete(scope.$index, scope.row)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>
