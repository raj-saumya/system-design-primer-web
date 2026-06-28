import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://system-design-primer-web.pages.dev",
  trailingSlash: "always",
  integrations: [
    svelte(),
    mdx(),
    sitemap({ changefreq: "weekly", priority: 0.7 }),
  ],
  markdown: {
    shikiConfig: { theme: "github-dark", wrap: true },
  },
});
