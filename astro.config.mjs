// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://weuxstudio.github.io',
  base: '/content-finder-site',
  vite: {
    plugins: [tailwindcss()]
  }
});