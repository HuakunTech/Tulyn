<script setup lang="ts">
import { toast } from "vue-sonner";

onMounted(() => {
  // toast.success("hello", {
  //   position: "bottom-left",
  // });
});
</script>
<template>
  <el-button @click="ElMessage('hello')">button</el-button>
  <ElButton :icon="ElIconEditPen" type="success">button</ElButton>
  <LazyElButton type="warning">lazy button</LazyElButton>
</template>
