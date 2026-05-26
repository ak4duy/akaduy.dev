# [yud-on.top](https://yud-on.top)

Temporary domain for now (nobrain domain name ngl). I originally bought it for a self-hosted ebook project, but I'm using it for my personal website until next year.

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

No user accounts are required, and no personal information is intentionally collected.

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

- Code: [MIT](https://choosealicense.com/licenses/mit/)
- Blog posts, personal writing, images, and branding are © ak4duy. All rights reserved unless stated otherwise.