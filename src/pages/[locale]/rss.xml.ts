import rss from "@astrojs/rss";
import type { APIContext, GetStaticPaths } from "astro";
import { getBlogPostDateTime, getBlogPosts } from "@/lib/blog-posts";
import { languages, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/routes";

export const getStaticPaths = (() =>
  languages.map((language) => ({
    params: { locale: language.toLowerCase() },
    props: { language },
  }))) satisfies GetStaticPaths;

export function GET({ props, site }: APIContext<{ language: Language }>) {
  const { language } = props;
  return rss({
    title: "akaduy blog",
    description: language === "VN" ? "Bài viết của akaduy" : "Writing by akaduy",
    site: site!,
    items: getBlogPosts(language).map((post) => ({
      title: post.title,
      description: post.excerpt,
      pubDate: new Date(getBlogPostDateTime(post.date)),
      categories: post.tags,
      link: localizedPath(language, `blog/${post.slug}`),
    })),
    customData: `<language>${language === "VN" ? "vi" : "en"}</language>`,
  });
}
