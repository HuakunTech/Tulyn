<template>
  <el-progress :percentage="overallProgressPercentage" />
  <el-tree
    ref="treeRef"
    style="max-width: 600px"
    :data="devProgressRawData"
    show-checkbox
    default-expand-all
    node-key="id"
    highlight-current
    :props="defaultProps"
    disabled
  />
</template>

<script lang="ts" setup>
import { useColorMode } from "@vueuse/core";
useColorMode();
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import { devProgressRawData, finishedIds, overallProgressPercentage } from "./data";
import { onMounted, ref } from "vue";
import { ElTree } from "element-plus";

const treeRef = ref<InstanceType<typeof ElTree>>();

onMounted(() => {
  treeRef.value!.setCheckedKeys(finishedIds, true);
});

const defaultProps = {
  children: "children",
  label: "label",
};
</script>
