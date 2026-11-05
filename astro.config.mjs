import { defineConfig } from "astro/config";
import sitemapLastmod from "./src/integrations/sitemap-lastmod.mjs";

export default defineConfig({
  site: "https://tech-wedge.com",
  integrations: [sitemapLastmod()],
  build: {
    format: "file",
  },
});