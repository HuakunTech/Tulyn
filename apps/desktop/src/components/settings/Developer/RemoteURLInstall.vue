<script setup lang="ts">
import { InfoIcon, ExternalLinkIcon, CloudDownloadIcon, DownloadIcon } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import { useToast } from "@/components/ui/toast";
import { RemoteExt, RemoteExtension } from "@/lib/extension/remoteExt";

const remoteExt = new RemoteExtension();
const { toast } = useToast();
const remoteUrl = ref("");
const name = ref("");
const triggerKeywords = ref(["remote"]);
const open = ref(false);

function onSave() {
  try {
    const remoteExtPayload = RemoteExt.parse({
      name: name.value,
      id: uuidv4(),
      url: remoteUrl.value,
      triggerCmds: triggerKeywords.value,
    });
    remoteExt.addRemoteExt(remoteExtPayload);
    toast({
      title: "Installed 1 Remote Command",
    });
    open.value = false; // close dialog
  } catch (error) {
    toast({
      title: "Wrong Format",
      variant: "destructive",
    });
  }
}
</script>
<template>
  <div class="flex w-full items-center gap-1.5">
    <Dialog v-model:open="open">
      <div class="flex justify-center w-full">
        <DialogTrigger as-child>
          <Button type="submit" size="sm"
            >Add A Remote URL Command<CloudDownloadIcon class="ml-2 h-4 w-4"
          /></Button>
        </DialogTrigger>
      </div>
      <DialogContent class="sm:max-w-[35rem]">
        <DialogHeader>
          <DialogTitle>Add Remote URL</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Name</Label>
            <Input id="name" v-model="name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Keywords</Label>
            <TagsInput v-model="triggerKeywords" class="col-span-3">
              <TagsInputItem v-for="item in triggerKeywords" :key="item" :value="item">
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>

              <TagsInputInput placeholder="Keywords..." />
            </TagsInput>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="url" class="text-right">Remote URL</Label>
            <Input id="url" v-model="remoteUrl" class="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" @click="onSave">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
