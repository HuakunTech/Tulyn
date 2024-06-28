import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@astrojs/react";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://astro.build/config
export default defineConfig({
  integrations: [vue({ appEntrypoint: "/src/lib/vue", devtools: true }), tailwind(), react()],
  
  vite: {
    plugins: [
      visualizer(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
});
