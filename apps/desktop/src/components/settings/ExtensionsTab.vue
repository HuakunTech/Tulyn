<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type TListItem } from "jarvis-api";
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
const tableData = ref<TListItem[]>([]);

onMounted(async () => {
  Promise.all([devExt.load(), storeExt.load(), remoteExt.load()]).then(() => {
    tableData.value = [
      ...storeExt.$listItems.get(),
      ...devExt.$listItems.get(),
      ...remoteExt.$listItems.get(),
    ];
  });
});

function handleDelete(index: number, item: TListItem) {
  console.log(index, item);
  // if (item.type === 'Remote Command') {

  // } else if (item.type == '')
  ElMessage.success({
    message: `Deleted Extension: ${item.title}`,
  });
}
</script>
<template>
  <el-table :data="tableData" class="w-full" height="100%" size="small">
    <el-table-column label="Name">
      <template #default="scope">
        <div class="flex items-center space-x-2">
          <img
            width="20"
            class="mr-2"
            v-if="scope.row.icon?.type === 'remote-url'"
            :src="scope.row.icon?.value"
            alt=""
          />
          <Icon
            v-else-if="scope.row.icon?.type === 'iconify'"
            :icon="scope.row.icon.value"
            class="w-4 h-4 mr-2"
          />
          <Icon v-else icon="mingcute:appstore-fill" class="w-4 h-4 mr-2" />
          <span class="">{{ scope.row.title }}</span>
          <Icon
            v-if="scope.row.flags.isDev"
            icon="ph:dev-to-logo-fill"
            class="inline w-5 h-6 text-green-500"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="Type" />
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
