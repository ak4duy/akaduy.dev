# [akaduy.dev](https://akaduy.dev)

[![Website status](https://github.com/ak4duy/akaduy.dev/actions/workflows/static.yml/badge.svg)](https://github.com/ak4duy/akaduy.dev/actions/workflows/static.yml)

## Description

My personal portfolio and blog website.

I write blogs here and share updates about my personal projects.

Since I also publish blog posts here, many of my GitHub contributions may come from updates to this repository.

## Stack & Tools

- Astro
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React
- Markdown

## Privacy

This website does not use cookies or advertising trackers.

No user accounts are required, and no personal information is intentionally collected through forms.

Blog polls store the selected poll option and poll ID in Cloudflare D1. To reduce vote spam, the API stores a salted hash derived from technical request data such as IP address, User-Agent, and poll ID. Raw IP addresses are not stored in the poll database.

The website is hosted using GitHub Pages and Cloudflare. These providers may temporarily process technical information (such as IP addresses, browser information, or request metadata) as part of delivering and securing the website.

## Structure

```txt
src/pages/           Astro routes
src/layouts/         shared document and metadata
components/          UI and page components
content/blog-posts/  markdown blog posts
lib/blog-posts.ts    blog parser/helpers
lib/i18n/            translations
styles/globals.css   shared styles
public/              static assets
workers/             Cloudflare APIs
```

## Analytics proxy

Self-hosted Umami (`https://umami.akaduy.dev`) is served through a Cloudflare Worker following the
[Umami proxy guide](https://docs.umami.is/docs/bypass-ad-blockers):

- `/s.js` serves the current Umami tracker, cached in the browser for one hour.
- `/api/send` forwards tracking requests to Umami without caching responses.
- The proxy preserves Umami session headers and forwards the visitor IP and browser
  user agent to Umami. It does not log or store request bodies or IP addresses.

Before deploying the website change, ensure the `akaduy.dev` DNS record is
**Proxied** (orange cloud) in Cloudflare, then deploy the Worker:

```sh
npm run worker:umami:test
npm run worker:umami:deploy
```

Wrangler requires a Cloudflare login (`npx wrangler login`) or a
`CLOUDFLARE_API_TOKEN` with Workers Scripts and zone Workers Routes permissions.
The Worker routes only the two paths above; GitHub Pages continues serving the site.
Deploying GitHub Pages alone does not deploy this Worker.

After the Worker is deployed, deploy the website through the existing GitHub Pages
workflow. Check that `/s.js` returns JavaScript and that browser requests to
`https://akaduy.dev/api/send` return HTTP 200 when visiting and navigating the site.
Tracking is restricted to `akaduy.dev`, so local development does not record visits.
This reduces blocking by domain-based lists; it cannot guarantee every blocker
will allow tracking.

## Blog posts

Posts live in:

```txt
content/blog-posts/en/
content/blog-posts/vn/
```

## Translations

Translations are split by locale:

```txt
lib/i18n/index.ts
lib/i18n/en.ts
lib/i18n/vn.ts
```

## License

- Code: [GNU GPLv3 or later](./LICENSE)
- Blog posts and personal writing: [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)
- Images and branding are © Aka Duy. All rights reserved unless stated otherwise.
