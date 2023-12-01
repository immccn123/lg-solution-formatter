import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import child_process from "child_process";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    "import.meta.env.VITE_COMMIT_HASH": JSON.stringify(
      child_process.execSync("git rev-parse HEAD").toString().trim()
    ),
  },
  build: {
    cssMinify: "lightningcss",
  },
});
