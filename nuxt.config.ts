import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname);

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  alias: {
    "@": projectRoot,
    "~": projectRoot,
  },
  pages: true,
  components: true, // Enable component auto-import
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt", "@nuxt/icon"],
  vite: {
    resolve: {
      alias: {
        "@": projectRoot,
        "~": projectRoot,
      },
    },
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    config: {},
  },
});
