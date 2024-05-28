<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; imgSrc: string[]; open: boolean }>();
const emits = defineEmits<{
  (e: "update:open", open: boolean): void;
}>();
</script>

<template>
  <Dialog
    :class="props.class"
    :open="props.open"
    @update:open="(open) => emits('update:open', open)"
  >
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="max-h-screen max-w-screen-md">
      <Carousel class="relative w-full">
        <CarouselContent class="h-full">
          <CarouselItem v-for="(src, index) in props.imgSrc" :key="index" class="h-full">
            <img :src="src" class="h-full w-full" alt="" />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </DialogContent>
  </Dialog>
</template>
