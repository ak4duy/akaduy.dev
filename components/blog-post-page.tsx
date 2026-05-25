"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";
import { MarkdownContent } from "@/components/markdown-content";
import { BlogPost } from "@/lib/blog-posts";
import { Language, translations } from "@/lib/i18n";

type BlogPostPageProps = {
  initialLanguage: Language;
  post: BlogPost;
};

export function BlogPostPage({ initialLanguage, post }: BlogPostPageProps) {
  const { language, setLanguage } = useLanguage();
  const t = translations[initialLanguage];
  const localePrefix = `/${initialLanguage.toLowerCase()}`;

  useEffect(() => {
    if (language !== initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage, language, setLanguage]);

  if (!post) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="relative mx-auto max-w-2xl px-6 py-16">
          <p className="text-sm text-muted-foreground">Post not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-linear-to-br from-background via-background to-accent/20 pointer-events-none" />

      <article className="relative mx-auto max-w-3xl px-6 py-16 page-enter">
        <header className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={`${localePrefix}/blog`}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t.nav.blog}
            </Link>
            <LanguageToggle />
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/70">
            <time>{post.date}</time>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-muted/50 border border-border px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 h-px bg-linear-to-r from-border via-muted-foreground/30 to-transparent" />
        </header>

        <div className="rounded-2xl border border-border/80 bg-card/95 p-6 shadow-2xl shadow-black/20 ring-1 ring-foreground/5 tab-enter sm:p-8">
          <MarkdownContent
            content={post.content}
            contentsLabel={t.blog.contents}
          />
        </div>

        <SiteFooter tagline={t.home.footer} />
      </article>
    </main>
  );
}
