<script setup>
import { ref, onMounted } from "vue";
import { system, apps } from "@jarvis/api";

const list = ref(system.systemCommandListItems);

const itemRefs = ref([]);

onMounted(() => {
  console.log(itemRefs.value);
  setTimeout(() => {
    console.log(itemRefs.value[20]);
    itemRefs.value[20].scrollIntoView({ behavior: "smooth" });
  }, 4000);
});
</script>

<template>
  <ul class="prose dark:prose-invert">
    <li v-for="item in list" ref="itemRefs">
      {{ item.title }}
    </li>
  </ul>
</template>
