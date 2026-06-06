"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { BlogPoll } from "@/components/blog-poll";
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

type ReaderTheme = "dark" | "sepia" | "light";

const readerThemes: Array<{ value: ReaderTheme; label: string }> = [
  { value: "dark", label: "Dark" },
  { value: "sepia", label: "Warm" },
  { value: "light", label: "Light" },
];

const READING_POSITION_STORAGE_PREFIX = "blog-reading-position";
const COMPLETED_READING_THRESHOLD = 0.90;

function getReadingPositionStorageKey(language: Language, slug: string) {
  return `${READING_POSITION_STORAGE_PREFIX}:${language.toLowerCase()}:${slug}`;
}

function getStoredReadingPosition(storageKey: string) {
  const value = Number(window.localStorage.getItem(storageKey));

  return Number.isFinite(value) &&
    value > 0 &&
    value < COMPLETED_READING_THRESHOLD
    ? value
    : null;
}

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
  const themeAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const themeAnimationFrameRef = useRef<number | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("dark");
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [showStickyContents, setShowStickyContents] = useState(false);

  useEffect(() => {
    if (language !== initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage, language, setLanguage]);

  useEffect(() => {
    const savedReaderTheme = window.localStorage.getItem("reader-theme");

    if (
      savedReaderTheme === "dark" ||
      savedReaderTheme === "sepia" ||
      savedReaderTheme === "light"
    ) {
      setReaderTheme(savedReaderTheme);
    }
  }, []);

  const handleStickyContentsChange = useCallback((visible: boolean) => {
    setShowStickyContents(visible);
  }, []);

  const handleReaderThemeChange = (nextTheme: ReaderTheme) => {
    if (nextTheme === readerTheme) {
      return;
    }

    if (themeAnimationTimeoutRef.current) {
      clearTimeout(themeAnimationTimeoutRef.current);
    }

    if (themeAnimationFrameRef.current) {
      cancelAnimationFrame(themeAnimationFrameRef.current);
    }

    setReaderTheme(nextTheme);
    setIsThemeChanging(false);
    window.localStorage.setItem("reader-theme", nextTheme);

    themeAnimationFrameRef.current = requestAnimationFrame(() => {
      setIsThemeChanging(true);
      themeAnimationFrameRef.current = null;
    });

    themeAnimationTimeoutRef.current = setTimeout(() => {
      setIsThemeChanging(false);
      themeAnimationTimeoutRef.current = null;
    }, 320);
  };

  useEffect(() => {
    return () => {
      if (themeAnimationTimeoutRef.current) {
        clearTimeout(themeAnimationTimeoutRef.current);
      }

      if (themeAnimationFrameRef.current) {
        cancelAnimationFrame(themeAnimationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const root = readingRootRef.current;

    if (!root) {
      return;
    }

    const storageKey = getReadingPositionStorageKey(initialLanguage, post.slug);
    let hasRestoredReadingPosition = false;
    let restoreFrame: number | null = null;
    let lastSavedPosition = getStoredReadingPosition(storageKey) ?? 0;

    const getReadingMetrics = () => {
      const rect = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const articleTop = window.scrollY + rect.top;
      const scrollableDistance = Math.max(rect.height - viewportHeight, 1);
      const progressed = (0 - rect.top) / scrollableDistance;
      const clamped = Math.min(1, Math.max(0, progressed));

      return { articleTop, clamped, scrollableDistance };
    };

    const saveReadingPosition = (position: number) => {
      if (position >= COMPLETED_READING_THRESHOLD) {
        window.localStorage.removeItem(storageKey);
        lastSavedPosition = 0;
        return;
      }

      if (Math.abs(position - lastSavedPosition) < 0.01) {
        return;
      }

      window.localStorage.setItem(storageKey, position.toFixed(4));
      lastSavedPosition = position;
    };

    const updateScrollState = () => {
      const { clamped } = getReadingMetrics();
      setReadingProgress(clamped);

      if (hasRestoredReadingPosition) {
        saveReadingPosition(clamped);
      }
    };

    restoreFrame = requestAnimationFrame(() => {
      const savedPosition = getStoredReadingPosition(storageKey);

      if (savedPosition !== null) {
        const { articleTop, scrollableDistance } = getReadingMetrics();
        window.scrollTo({
          top: articleTop + savedPosition * scrollableDistance,
          behavior: "auto",
        });
      }

      hasRestoredReadingPosition = true;
      updateScrollState();
    });

    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      if (restoreFrame !== null) {
        cancelAnimationFrame(restoreFrame);
      }

      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [initialLanguage, post.slug]);

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
  const isNovelStyle = post.style === "novel";
  const hasInlinePoll = /\{\{blogPoll(?::\d+)?\}\}/.test(post.content);
  const pollLabels = {
    vote: t.blog.pollVote,
    cancel: t.blog.pollCancel,
    votes: t.blog.pollVotes,
    voted: t.blog.pollVoted,
    undo: t.blog.pollUndo,
    loading: t.blog.pollLoading,
    privacy: t.blog.pollPrivacy,
    privacyLink: t.blog.pollPrivacyLink,
    error: t.blog.pollError,
  };
  const pollNodes = post.polls.map((poll) => (
    <BlogPoll
      key={poll.id}
      poll={poll}
      privacyHref={`https://akaduy.dev${localePrefix}/privacy`}
      labels={pollLabels}
    />
  ));
  const pollNode = pollNodes[0] ?? null;

  return (
    <main
      className={`reader-theme-${readerTheme} min-h-screen reader-bg reader-text transition-colors duration-300 ${
        isThemeChanging ? "reader-theme-changing" : ""
      }`}
    >
      <div className="fixed inset-0 z-0 reader-background-layer pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-linear-to-br from-transparent via-transparent to-[color-mix(in_oklch,var(--reader-accent)_55%,transparent)] pointer-events-none" />
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 reader-accent-bg">
        <div
          className="h-full bg-(--reader-foreground) transition-[width] duration-100"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="fixed right-4 top-2 z-50 hidden rounded-md border reader-border bg-[color-mix(in_oklch,var(--reader-background)_82%,transparent)] px-2 py-1 text-[11px] font-medium reader-muted backdrop-blur sm:block">
        {progressPercent}%
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        aria-hidden={!showStickyContents}
        tabIndex={showStickyContents ? 0 : -1}
        className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border reader-border bg-[color-mix(in_oklch,var(--reader-background)_85%,transparent)] reader-muted shadow-xl shadow-black/10 backdrop-blur transition-all duration-200 ease-out hover:bg-(--reader-card) hover:reader-text active:scale-95 sm:bottom-6 sm:right-6 sm:h-11 sm:w-11 sm:hover:-translate-y-0.5 ${
          showStickyContents
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-75 opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <article
        ref={readingRootRef}
        className={`relative z-10 mx-auto px-6 py-16 page-enter ${
          isNovelStyle ? "max-w-184" : "max-w-3xl"
        }`}
      >
        <header className="mb-10">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <BackToBlogLink href={`${localePrefix}/blog`} label={t.nav.blog} />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border reader-border bg-[color-mix(in_oklch,var(--reader-card)_65%,transparent)] p-1 text-xs">
                {readerThemes.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => handleReaderThemeChange(theme.value)}
                    className={`rounded-md px-2 py-1 font-medium transition-colors ${
                      readerTheme === theme.value
                        ? "bg-(--reader-foreground) text-(--reader-background)"
                        : "reader-muted hover:reader-text"
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
              <LanguageToggle />
            </div>
          </div>

          <h1
            className={`font-bold tracking-tight reader-text ${
              isNovelStyle ? "text-center text-4xl sm:text-5xl" : "text-4xl"
            }`}
          >
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs reader-muted">
            <time>{post.date}</time>
            <span aria-hidden="true">|</span>
            <span>
              {readingTimeMinutes} {t.blog.minuteRead}
            </span>
            <div className="ml-auto flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border/80 bg-muted/20 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 h-px bg-linear-to-r from-transparent via-(--reader-border) to-transparent" />
        </header>

        <div
          className={
            isNovelStyle
              ? "tab-enter"
              : "rounded-2xl border reader-card p-6 shadow-2xl shadow-black/15 ring-1 ring-[color-mix(in_oklch,var(--reader-foreground)_8%,transparent)] tab-enter sm:p-8"
          }
        >
          <MarkdownContent
            content={post.content}
            contentsLabel={t.blog.contents}
            stickyBackHref={`${localePrefix}/blog`}
            stickyBackLabel={t.nav.blog}
            poll={pollNode}
            polls={pollNodes}
            readerStyle={post.style}
            afterFirstRule={!hasInlinePoll ? pollNode : null}
            onStickyContentsChangeAction={handleStickyContentsChange}
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
