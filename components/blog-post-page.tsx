"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";
import { MarkdownContent } from "@/components/markdown-content";
import { BlogPost } from "@/lib/blog-posts";
import { Language, translations } from "@/lib/i18n/index";

type BlogPostPageProps = {
  initialLanguage: Language;
  post: BlogPost;
};

// based on 200 wpm
function getReadingTimeMinutes(content: string) {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/[#>*_~`\-\d.]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

function BackToBlogLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </Link>
  );
}

export function BlogPostPage({ initialLanguage, post }: BlogPostPageProps) {
  const { language, setLanguage } = useLanguage();
  const t = translations[initialLanguage];
  const localePrefix = `/${initialLanguage.toLowerCase()}`;
  const readingRootRef = useRef<HTMLElement | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (language !== initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage, language, setLanguage]);

  useEffect(() => {
    const root = readingRootRef.current;

    if (!root) {
      return;
    }

    const updateScrollState = () => {
      const rect = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = Math.max(rect.height - viewportHeight, 1);
      const progressed = (0 - rect.top) / scrollableDistance;
      const clamped = Math.min(1, Math.max(0, progressed));
      setReadingProgress(clamped);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [post.slug]);

  if (!post) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="relative mx-auto max-w-2xl px-6 py-16">
          <p className="text-sm text-muted-foreground">Post not found.</p>
        </div>
      </main>
    );
  }

  const progressPercent = Math.round(readingProgress * 100);
  const readingTimeMinutes = getReadingTimeMinutes(post.content);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-linear-to-br from-background via-background to-accent/20 pointer-events-none" />
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-muted/60">
        <div
          className="h-full bg-foreground transition-[width] duration-100"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="fixed right-4 top-2 z-50 hidden rounded-md border border-border/80 bg-background/80 px-2 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur sm:block">
        {progressPercent}%
      </div>

      <article
        ref={readingRootRef}
        className="relative mx-auto max-w-3xl px-6 py-16 page-enter"
      >
        <header className="mb-10">
          <div className="mb-2 flex items-center justify-between">
            <BackToBlogLink href={`${localePrefix}/blog`} label={t.nav.blog} />
            <LanguageToggle />
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground/70">
            <time>{post.date}</time>
            <span aria-hidden="true">|</span>
            <span>
              {readingTimeMinutes} {t.blog.minuteRead}
            </span>
            <div className="ml-auto flex gap-2">
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
          <div className="mt-4 h-px bg-linear-to-r from-transparent via-muted-foreground/35 to-transparent" />
        </header>

        <div className="rounded-2xl border border-border/80 bg-card/95 p-6 shadow-2xl shadow-black/20 ring-1 ring-foreground/5 tab-enter sm:p-8">
          <MarkdownContent
            content={post.content}
            contentsLabel={t.blog.contents}
            stickyBackHref={`${localePrefix}/blog`}
            stickyBackLabel={t.nav.blog}
          />
        </div>

        <SiteFooter
          tagline={t.home.footer}
          privacyHref={`${localePrefix}/privacy`}
        />
      </article>
    </main>
  );
}
