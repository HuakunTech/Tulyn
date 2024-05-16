<script setup>
const props = defineProps(["data"]);
</script>
<template>
  <div class="inline-block cursor-pointer w-4 h-4" :title="props.data.name"></div>
</template>
