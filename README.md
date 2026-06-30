# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm test`                | Run API function tests                           |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Pro update API

The Cloudflare Pages Functions under `/api/weux-content-finder/pro/*` power the WEUX Content Finder Pro updater.

Required Cloudflare environment variables:

- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_PRODUCT_ID`
- `PRO_DOWNLOAD_TOKEN_SECRET`

Optional environment variables:

- `PRO_CHANGELOG_HTML`
- `PRO_MIN_WP_VERSION` defaults to `7.0`
- `PRO_TESTED_WP_VERSION` defaults to `7.0`
- `PRO_MIN_PHP_VERSION` defaults to `8.0`

Release flow:

1. Upload the Pro ZIP to the matching Lemon Squeezy variant file.
2. Publish the file and set its version in Lemon Squeezy.
3. Deploy this site with the production Lemon Squeezy API key and product ID.
4. The updater validates the license, finds the latest published ZIP for the purchased variant, and redirects downloads to Lemon Squeezy signed download URLs.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
