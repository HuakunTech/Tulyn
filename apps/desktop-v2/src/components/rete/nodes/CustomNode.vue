<script setup>
import { Ref } from "rete-vue-plugin";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function sortByIndex(entries) {
  entries.sort((a, b) => {
    const ai = (a[1] && a[1].index) || 0;
    const bi = (b[1] && b[1].index) || 0;

    return ai - bi;
  });
  return entries;
}

const props = defineProps(["data", "emit", "seed"]);

function inputs() {
  return sortByIndex(Object.entries(props.data.inputs));
}
function controls() {
  return sortByIndex(Object.entries(props.data.controls));
}
function outputs() {
  return sortByIndex(Object.entries(props.data.outputs));
}
</script>
<template>
  <Card class="w-96 p-0">
    <CardHeader>
      <CardTitle>{{ props.data.label }}</CardTitle>
      <CardDescription></CardDescription>
    </CardHeader>
    <CardContent class="">
      <div v-for="[key, input] in inputs()" :key="key + seed" :data-testid="'input-' + key">
        <Ref
          class="input-socket absolute left-0 -translate-x-1/2"
          :emit="emit"
          :data="{
            type: 'socket',
            side: 'input',
            key: key,
            nodeId: data.id,
            payload: input.socket,
          }"
          data-testid="input-socket"
        />
        <div
          class="input-title"
          v-show="!input.control || !input.showControl"
          data-testid="input-title"
        >
          {{ input.label }}
        </div>
        <Ref
          class="input-control"
          v-show="input.control && input.showControl"
          :emit="emit"
          :data="{ type: 'control', payload: input.control }"
          data-testid="input-control"
        />
      </div>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
</template>
