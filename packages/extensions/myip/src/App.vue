<script setup lang="ts">
import { onMounted, ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import axios from "axios";
import { z } from "zod";

const ip = ref("");

onMounted(() => {
  axios
    .get("https://api.ipify.org?format=json")
    .then((response) => {
      ip.value = z.object({ ip: z.string() }).parse(response.data).ip;
    })
    .catch((err) => {
      console.error(err);
      return axios.get("https://ifconfig.me/all.json").then((response) => {
        ip.value = z
          .object({ ip_addr: z.string() })
          .parse(response.data).ip_addr;
      });
    });
});
</script>

<template>
  <main class="h-screen flex justify-center items-center">
    <h1 class="text-4xl font-bold">{{ ip }}</h1>
  </main>
</template>
