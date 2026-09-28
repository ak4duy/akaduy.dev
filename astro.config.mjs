import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://akaduy.dev",
  output: "static",
  trailingSlash: "always",
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [react()],
  build: { format: "directory" },
  vite: { plugins: [tailwindcss()] },
});
