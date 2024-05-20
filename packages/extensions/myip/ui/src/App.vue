<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { z } from "zod";
import { clipboard } from "@jarvis/api-ui";
import { useColorMode } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();

const IpInfo = z.object({
  status: z.string(),
  continent: z.string(),
  country: z.string(),
  countryCode: z.string(),
  region: z.string(),
  regionName: z.string(),
  city: z.string(),
  district: z.string(),
  zip: z.string(),
  lat: z.number(),
  lon: z.number(),
  timezone: z.string(),
  offset: z.number(),
  currency: z.string(),
  isp: z.string(),
  org: z.string(),
  as: z.string(),
  asname: z.string(),
  reverse: z.string(),
  proxy: z.boolean(),
  hosting: z.boolean(),
  query: z.string(),
});

const ip = ref<z.infer<typeof IpInfo> | undefined>();
const ipSearchTerm = ref<string>("");
const mode = useColorMode();

function searchIp(ipv4?: string) {
  const apiUrl = `http://ip-api.com/json${ipv4 ? "/" + ipv4 : ""}?fields=status,message,continent,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,proxy,hosting,query`;
  return axios
    .get(apiUrl)
    .then((response) => {
      ip.value = IpInfo.parse(response.data);
      ipSearchTerm.value = ip.value.query;
    })
    .catch((error) => {
      console.error(error);
    });
}

onMounted(() => {
  searchIp();
});

function onSelect(content: any) {
  console.log(content);

  clipboard
    .writeText(content)
    .then(() => {
      return toast({
        title: "Copied to Clipboard",
      });
    })
    .catch((error) => {
      console.error(error);
      return toast({
        title: "Failed to copy to Clipboard",
        variant: "destructive",
      });
    });
}

function onIpSearch(e: Event) {
  e.preventDefault();
  // check regex of ipSearchTerm must be IPv4
  if (/^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/.test(ipSearchTerm.value)) {
    return searchIp(ipSearchTerm.value);
  }
}
</script>
<template>
  <Toaster />
  <main class="h-screen bg-background text-foreground">
    <!-- <ModeToggle /> -->
    <Command class="rounded-lg border shadow-md text-xl">
      <div class="flex gap-1.5 px-2">
        <span class="grow"><CommandInput placeholder="Type to search..." class="" /></span>
        <form class="flex w-full items-center gap-1.5 max-w-xs" @submit="onIpSearch">
          <Input id="IP Address" type="text" placeholder="IP Address" v-model="ipSearchTerm" />
          <Button type="submit" variant="outline">Search</Button>
        </form>
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup v-if="ip" heading="IP Info">
          <CommandItem value="Public IP" class="space-x-3" @select="() => onSelect(ip!.query)">
            <Icon icon="mdi:web" class="w-4 h-4" />
            <span class="font-bold">Public IPv4</span>
            <span class="text-muted-foreground">{{ ip.query }}</span>
          </CommandItem>
          <CommandItem value="continent" class="space-x-3" @select="() => onSelect(ip!.continent)">
            <Icon icon="mdi:earth" class="w-4 h-4" />
            <span class="font-bold">Continent</span>
            <span class="text-muted-foreground">{{ ip.continent }}</span>
          </CommandItem>
          <CommandItem value="country" class="space-x-3" @select="() => onSelect(ip!.country)">
            <Icon icon="gis:search-country" class="w-4 h-4" />
            <span class="font-bold">Country</span>
            <span class="text-muted-foreground">{{ ip.country }}</span>
          </CommandItem>
          <CommandItem
            value="countryCode"
            class="space-x-3"
            @select="() => onSelect(ip!.countryCode)"
          >
            <Icon icon="ic:baseline-code" class="w-4 h-4" />
            <span class="font-bold">Country Code</span>
            <span class="text-muted-foreground">{{ ip.countryCode }}</span>
          </CommandItem>
          <CommandItem value="region" class="space-x-3" @select="() => onSelect(ip!.region)">
            <Icon icon="mdi:web" class="w-4 h-4" />
            <span class="font-bold">Region</span>
            <span class="text-muted-foreground">{{ ip.region }}</span>
          </CommandItem>
          <CommandItem
            value="regionName"
            class="space-x-3"
            @select="() => onSelect(ip!.regionName)"
          >
            <Icon icon="oui:vis-map-region" class="w-4 h-4" />
            <span class="font-bold">Region Name</span>
            <span class="text-muted-foreground">{{ ip.regionName }}</span>
          </CommandItem>
          <CommandItem value="city" class="space-x-3" @select="() => onSelect(ip!.city)">
            <Icon icon="solar:city-bold" class="w-4 h-4" />
            <span class="font-bold">City</span>
            <span class="text-muted-foreground">{{ ip.city }}</span>
          </CommandItem>
          <CommandItem value="district" class="space-x-3" @select="() => onSelect(ip!.district)">
            <Icon icon="oui:vis-map-region" class="w-4 h-4" />
            <span class="font-bold">District</span>
            <span class="text-muted-foreground">{{ ip.district }}</span>
          </CommandItem>
          <CommandItem value="zip" class="space-x-3" @select="() => onSelect(ip!.zip)">
            <Icon icon="tabler:zip" class="w-4 h-4" />
            <span class="font-bold">ZIP</span>
            <span class="text-muted-foreground">{{ ip.zip }}</span>
          </CommandItem>
          <CommandItem
            value="lat"
            class="space-x-3"
            @select="() => onSelect(`${ip!.lat}, ${ip!.lon}`)"
          >
            <Icon icon="pepicons-pop:map" class="w-4 h-4" />
            <span class="font-bold">GeoCoordinates</span>
            <span class="text-muted-foreground">{{ ip.lat }}, {{ ip.lon }}</span>
          </CommandItem>
          <CommandItem value="timezone" class="space-x-3" @select="() => onSelect(ip!.timezone)">
            <Icon icon="mdi:timezone" class="w-4 h-4" />
            <span class="font-bold">Timezone</span>
            <span class="text-muted-foreground">{{ ip.timezone }}</span>
          </CommandItem>
          <CommandItem
            value="offset"
            class="space-x-3"
            @select="() => onSelect(`${ip!.offset / 3600} hrs`)"
          >
            <Icon icon="mdi:clock" class="w-4 h-4" />
            <span class="font-bold">Offset</span>
            <span class="text-muted-foreground">{{ ip.offset / 3600 }} hrs</span>
          </CommandItem>
          <CommandItem value="currency" class="space-x-3" @select="() => onSelect(ip!.currency)">
            <Icon icon="simple-icons:bitcoinsv" class="w-4 h-4" />
            <span class="font-bold">Currency</span>
            <span class="text-muted-foreground">{{ ip.currency }}</span>
          </CommandItem>
          <CommandItem value="isp" class="space-x-3" @select="() => onSelect(ip!.isp)">
            <Icon icon="carbon:container-services" class="w-4 h-4" />
            <span class="font-bold">ISP</span>
            <span class="text-muted-foreground">{{ ip.isp }}</span>
          </CommandItem>
          <CommandItem value="org" class="space-x-3" @select="() => onSelect(ip!.org)">
            <Icon icon="clarity:organization-solid" class="w-4 h-4" />
            <span class="font-bold">Org</span>
            <span class="text-muted-foreground">{{ ip.org }}</span>
          </CommandItem>
          <CommandItem value="as" class="space-x-3" @select="() => onSelect(ip!.as)">
            <Icon icon="carbon:container-services" class="w-4 h-4" />
            <span class="font-bold">AS Number</span>
            <span class="text-muted-foreground">{{ ip.as }}</span>
          </CommandItem>
          <CommandItem value="asname" class="space-x-3" @select="() => onSelect(ip!.asname)">
            <Icon icon="carbon:container-services" class="w-4 h-4" />
            <span class="font-bold">AS Name</span>
            <span class="text-muted-foreground">{{ ip.asname }}</span>
          </CommandItem>
          <CommandItem value="reverse" class="space-x-3" @select="() => onSelect(ip!.reverse)">
            <Icon icon="material-symbols:dns" class="w-4 h-4" />
            <span class="font-bold">Reverse DNS</span>
            <span class="text-muted-foreground">{{ ip.reverse }}</span>
          </CommandItem>
          <CommandItem value="proxy" class="space-x-3" @select="() => onSelect(ip!.proxy)">
            <Icon icon="mdi:proxy" class="w-4 h-4" />
            <span class="font-bold">Proxy, VPN or Tor exit Address</span>
            <span class="text-muted-foreground">{{ ip.proxy }}</span>
          </CommandItem>
          <CommandItem value="hosting" class="space-x-3" @select="() => onSelect(ip!.hosting)">
            <Icon icon="clarity:host-solid" class="w-4 h-4" />
            <span class="font-bold">Hosting, colocated or data center</span>
            <span class="text-muted-foreground">{{ ip.hosting }}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </main>
</template>
