# [akaduy.dev](https://akaduy.dev)

[![Website status](https://github.com/ak4duy/akaduy.dev/actions/workflows/static.yml/badge.svg)](https://github.com/ak4duy/akaduy.dev/actions/workflows/static.yml)

## Description

My personal portfolio and blog website.

I write blogs here and share updates about my personal projects.

Since I also publish blog posts here, many of my GitHub contributions may come from updates to this repository.

## Stack & Tools

- Next.js
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
app/                 routes
components/          UI and page components
content/blog-posts/  markdown blog posts
lib/blog-posts.ts    blog parser/helpers
lib/i18n/            translations
public/              static assets
```

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
- Images and branding are © akaduy. All rights reserved unless stated otherwise.
