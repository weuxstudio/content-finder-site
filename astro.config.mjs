// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://contentfinderwp.com',
  integrations: [
    sitemap({
      filter: (page) => page === 'https://contentfinderwp.com/',
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
