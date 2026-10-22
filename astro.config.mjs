import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://akaduy.dev",
  output: "static",
  trailingSlash: "always",
  prefetch: false,
  integrations: [
    react(),
    sitemap({ filter: (page) => /\/(en|vn)\//.test(page) }),
  ],
  build: { format: "directory" },
  vite: { plugins: [tailwindcss()] },
});
