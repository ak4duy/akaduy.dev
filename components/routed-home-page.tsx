"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Tag, X } from "lucide-react";
import { CurrentWorkStatus } from "@/components/current-work-status";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";
import { BLOG_POSTS_PER_PAGE } from "@/lib/blog-config";
import type { BlogPost } from "@/lib/blog-posts";
import { Language, translations } from "@/lib/i18n/index";

const tools = ["Java", "Rust", "Python", "Linux"];
const interests = ["TypeScript", "JavaScript", "Kotlin", "Go"];

/*
  normalize vietnamese special cases
  copied from @/components/markdown-content
*/
function normalizeSearchText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/đ/g, "d")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/[\s-]+/g, " ");
}

function getBlogMonthKey(date: string) {
  const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, , month, year] = match;

  return `${year}-${month}`;
}

function getCalendarMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

function formatBlogMonth(monthKey: string, language: Language) {
  const [year, month] = monthKey.split("-").map(Number);

  if (!year || !month) {
    return monthKey;
  }

  return new Intl.DateTimeFormat(language === "VN" ? "vi-VN" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1));
}

function formatArchiveMonth(monthKey: string, language: Language) {
  const [, month] = monthKey.split("-").map(Number);

  if (!month) {
    return monthKey;
  }

  if (language === "VN") {
    return `THÁNG ${month}`;
  }

  return new Intl.DateTimeFormat("en-US", { month: "long" })
    .format(new Date(2026, month - 1))
    .toUpperCase();
}

export type TabValue = "about" | "experience" | "blog" | "contact";

type RoutedHomePageProps = {
  activeTab: TabValue;
  blogPosts: BlogPost[];
  initialLanguage?: Language;
  initialBlogPage?: number;
};

export function RoutedHomePage({
  activeTab,
  blogPosts,
  initialLanguage,
  initialBlogPage = 1,
}: RoutedHomePageProps) {
  const [currentTab, setCurrentTab] = useState<TabValue>(activeTab);
  const [blogSearch, setBlogSearch] = useState("");
  const [selectedBlogTag, setSelectedBlogTag] = useState<string | null>(null);
  const [selectedBlogMonth, setSelectedBlogMonth] = useState<string | null>(
    null,
  );
  const [isTagFilterDesktop, setIsTagFilterDesktop] = useState(false);
  const [blogPage, setBlogPage] = useState(initialBlogPage);
  const [routeBlogPage, setRouteBlogPage] = useState(initialBlogPage);
  const hasMountedBlogResetRef = useRef(false);
  const { language, setLanguage } = useLanguage();
  const activeLanguage = initialLanguage ?? language;
  const t = translations[activeLanguage];
  const localePrefix = `/${activeLanguage.toLowerCase()}`;
  const tabs = [
    { value: "about", label: t.nav.about, href: localePrefix },
    {
      value: "experience",
      label: t.nav.experience,
      href: `${localePrefix}/experience`,
    },
    { value: "blog", label: t.nav.blog, href: `${localePrefix}/blog` },
    { value: "contact", label: t.nav.contact, href: `${localePrefix}/contact` },
  ] as const;
  const normalizedBlogSearch = normalizeSearchText(blogSearch);
  const blogTags = Array.from(
    new Set(blogPosts.flatMap((post) => post.tags)),
  ).sort((a, b) => a.localeCompare(b));
  const blogMonthCounts = blogPosts.reduce((months, post) => {
    const monthKey = getBlogMonthKey(post.date);

    if (monthKey) {
      months.set(monthKey, (months.get(monthKey) ?? 0) + 1);
    }

    return months;
  }, new Map<string, number>());
  const currentDate = new Date();
  const currentMonthKey = getCalendarMonthKey(currentDate);
  const lastMonthKey = getCalendarMonthKey(
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
  );
  const monthlyWritingSummary = [
    {
      label: t.blog.thisMonth,
      count: blogMonthCounts.get(currentMonthKey) ?? 0,
    },
    {
      label: t.blog.lastMonth,
      count: blogMonthCounts.get(lastMonthKey) ?? 0,
    },
  ];
  const blogArchiveMonths = Array.from(blogMonthCounts).sort(([a], [b]) =>
    b.localeCompare(a),
  );
  const blogArchiveYears = blogArchiveMonths.reduce(
    (years, [monthKey, count]) => {
      const [year] = monthKey.split("-");
      const months = years.get(year) ?? [];

      months.push([monthKey, count]);
      years.set(year, months);

      return years;
    },
    new Map<string, Array<[string, number]>>(),
  );
  const hasBlogFilters = Boolean(
    normalizedBlogSearch || selectedBlogTag || selectedBlogMonth,
  );
  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesSearch = normalizedBlogSearch
      ? normalizeSearchText(
          [post.title, post.excerpt, post.date, ...post.tags].join(" "),
        ).includes(normalizedBlogSearch)
      : true;
    const matchesTag = selectedBlogTag
      ? post.tags.includes(selectedBlogTag)
      : true;
    const matchesMonth = selectedBlogMonth
      ? getBlogMonthKey(post.date) === selectedBlogMonth
      : true;

    return matchesSearch && matchesTag && matchesMonth;
  });
  const totalBlogPages = Math.max(
    1,
    Math.ceil(filteredBlogPosts.length / BLOG_POSTS_PER_PAGE),
  );
  const requestedBlogPage = hasBlogFilters ? blogPage : routeBlogPage;
  const currentBlogPage = Math.min(requestedBlogPage, totalBlogPages);
  const paginatedBlogPosts = filteredBlogPosts.slice(
    (currentBlogPage - 1) * BLOG_POSTS_PER_PAGE,
    currentBlogPage * BLOG_POSTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    setRouteBlogPage(initialBlogPage);
  }, [initialBlogPage]);

  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage, language, setLanguage]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const updateTagFilterPlacement = () => setIsTagFilterDesktop(query.matches);

    updateTagFilterPlacement();
    query.addEventListener("change", updateTagFilterPlacement);

    return () => {
      query.removeEventListener("change", updateTagFilterPlacement);
    };
  }, []);

  useEffect(() => {
    if (!hasMountedBlogResetRef.current) {
      hasMountedBlogResetRef.current = true;
      return;
    }

    setBlogPage(1);
  }, [blogSearch, selectedBlogTag, selectedBlogMonth, activeLanguage]);

  const getBlogPageHref = (page: number) =>
    page === 1 ? `${localePrefix}/blog` : `${localePrefix}/blog/${page}`;

  const handleBlogRoutePageChange = (page: number) => {
    setRouteBlogPage(page);
    setBlogPage(page);
    window.history.pushState(null, "", getBlogPageHref(page));
  };

  const handleTabChange = (value: string) => {
    const tab = tabs.find((tab) => tab.value === value);

    if (tab) {
      setCurrentTab(tab.value);

      if (tab.value === "blog") {
        setBlogPage(1);
        setRouteBlogPage(1);
      }

      window.history.pushState(null, "", tab.href);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-linear-to-br from-background via-background to-accent/20 pointer-events-none" />

      <div className="relative mx-auto max-w-2xl px-6 py-16 page-enter">
        <header className="mb-10">
          <div className="flex items-center justify-end mb-4">
            <LanguageToggle />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
            <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              akaduy
            </h1>
            <CurrentWorkStatus label={t.home.currentlyWorkingOn} />
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {t.home.intro}
          </p>
          <div className="mt-4 h-px bg-linear-to-r from-border via-muted-foreground/30 to-transparent" />
        </header>

        <div>
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-8 w-full justify-start gap-2 bg-transparent p-0 border-b border-border">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:text-foreground active:translate-y-0 active:scale-95 data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="about" className="space-y-8 tab-enter">
              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  {t.home.backgroundTitle}
                </h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground pl-4 border-l-2 border-border hover:border-muted-foreground/50 transition-colors duration-300">
                  {t.home.background.map((paragraph) => (
                    <p key={paragraph} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  {t.home.languagesTitle}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg bg-muted/50 border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:-translate-y-0.5 hover:bg-muted hover:text-foreground hover:scale-105 transition-all duration-150 ease-linear cursor-default"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  {t.home.interestedTitle}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-lg bg-muted/50 border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:-translate-y-0.5 hover:bg-muted hover:text-foreground hover:scale-105 transition-all duration-150 ease-linear cursor-default"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="experience" className="space-y-8 tab-enter">
              {[
                {
                  title: t.experience.workingOnTitle,
                  items: t.experience.workingOn,
                },
                {
                  title: t.experience.projectsTitle,
                  items: t.experience.projects,
                },
                {
                  title: t.experience.contributedToTitle,
                  items: t.experience.contributedTo,
                },
              ].map((section) => (
                <section key={section.title}>
                  <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item) => (
                      <div
                        key={item.name}
                        className="group rounded-xl border border-border bg-card/50 p-5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:scale-110 hover:text-foreground active:translate-y-0 active:scale-95"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                        <div className="mt-2 space-y-0 text-sm text-muted-foreground leading-relaxed">
                          {item.description.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-muted/50 border border-border px-2.5 py-1 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <section>
                <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  {t.home.educationTitle}
                </h2>
                <div className="group rounded-xl border border-border bg-card/50 p-5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-200">
                  <h3 className="font-semibold text-foreground">
                    {t.home.university}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t.home.universityDescription}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    {t.home.ongoing}
                  </span>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="blog" className="tab-enter">
              <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                {t.home.blogPostsTitle}
              </h2>
              <div className="mb-5 grid gap-3 sm:grid-cols-[2fr_1fr]">
                <div className="relative">
                  <input
                    type="text"
                    value={blogSearch}
                    onChange={(event) => setBlogSearch(event.target.value)}
                    placeholder={t.blog.searchPlaceholder}
                    aria-label={t.blog.searchPlaceholder}
                    className="h-12 w-full rounded-xl border border-border bg-card/50 px-4 pr-11 text-sm text-foreground outline-none transition-all duration-150 placeholder:text-muted-foreground/60 hover:bg-card hover:border-muted-foreground/30 focus:border-muted-foreground/50 focus:bg-card focus:ring-2 focus:ring-foreground/10"
                  />
                  {blogSearch && (
                    <button
                      type="button"
                      onClick={() => setBlogSearch("")}
                      aria-label={t.blog.clearTagFilter}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Select
                  value={selectedBlogTag ?? "all"}
                  onValueChange={(value) =>
                    setSelectedBlogTag(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger
                    aria-label={t.blog.tagFilterLabel}
                    className="
                       h-12! w-full rounded-xl border-border bg-card/50 px-4
                       text-muted-foreground shadow-none transition-all duration-150
                       hover:bg-card
                       hover:border-muted-foreground/30
                       hover:ring-2
                       hover:ring-foreground/10
                       focus:ring-0
                       focus:outline-none
                     "
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Tag className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                      <SelectValue placeholder={t.blog.allTags} />
                    </span>
                  </SelectTrigger>
                  <SelectContent
                    side={isTagFilterDesktop ? "right" : "bottom"}
                    align="start"
                    sideOffset={8}
                    className="max-h-64 rounded-xl border-border bg-card/95 backdrop-blur"
                  >
                    <SelectItem value="all">{t.blog.allTags}</SelectItem>
                    {blogTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasBlogFilters && (selectedBlogTag || selectedBlogMonth) && (
                <div className="mb-5 flex flex-wrap gap-2 text-xs">
                  {selectedBlogMonth && (
                    <button
                      type="button"
                      onClick={() => setSelectedBlogMonth(null)}
                      className="rounded-full border border-border bg-muted/30 px-3 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {formatArchiveMonth(selectedBlogMonth, activeLanguage)} ×
                    </button>
                  )}
                  {selectedBlogTag && (
                    <button
                      type="button"
                      onClick={() => setSelectedBlogTag(null)}
                      className="rounded-full border border-border bg-muted/30 px-3 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {selectedBlogTag} ×
                    </button>
                  )}
                </div>
              )}
              <div
                key={`${selectedBlogMonth ?? "all"}-${selectedBlogTag ?? "all"}-${blogSearch}-${currentBlogPage}`}
                className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-300"
              >
                {paginatedBlogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`${localePrefix}/blog/${post.slug}`}
                    className="block group rounded-xl border border-border bg-card/50 p-5 transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 active:translate-y-0 active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <span className="text-xs text-muted-foreground/70">
                        {post.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border/80 bg-muted/20 px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
                {filteredBlogPosts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                    {t.blog.noSearchResults}
                  </div>
                )}
              </div>
              <aside className="fixed left-[calc(50%+21rem+10px)] top-29 hidden w-48 font-mono text-sm xl:block">
                <h3 className="mb-5 text-center text-xs font-bold uppercase tracking-[0.24em] text-foreground">
                  {t.blog.archive}
                </h3>
                <div className="space-y-5">
                  {Array.from(blogArchiveYears).map(([year, months]) => (
                    <div key={year} className="relative pl-5">
                      <div className="absolute bottom-1 left-1.5 top-7 w-px bg-border" />
                      <div className="mb-3 inline-flex rounded-md border border-border bg-card/60 px-2.5 py-1 text-xs font-semibold tracking-[0.18em] text-foreground">
                        {year}
                      </div>
                      <div className="space-y-2.5">
                        {months.map(([monthKey, count]) => {
                          const isActiveMonth = monthKey === selectedBlogMonth;

                          return (
                            <button
                              key={monthKey}
                              type="button"
                              onClick={() =>
                                setSelectedBlogMonth((currentMonth) =>
                                  currentMonth === monthKey ? null : monthKey,
                                )
                              }
                              className={`relative grid w-full cursor-pointer grid-cols-[1fr_2.5rem] items-center gap-4 rounded-md px-1.5 py-1 text-left outline-none transition-all duration-200 hover:translate-x-1 hover:bg-muted/25 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/15 active:translate-x-0 ${
                                isActiveMonth
                                  ? "translate-x-1 bg-muted/30 text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`absolute left-[-1.12rem] h-2 w-2 rotate-45 rounded-[2px] border transition-all duration-200 ${
                                  isActiveMonth
                                    ? "scale-125 border-foreground bg-foreground"
                                    : "border-border bg-background"
                                }`}
                              />
                              <span>
                                {formatArchiveMonth(monthKey, activeLanguage)}
                              </span>
                              <span
                                className={`text-right font-semibold tabular-nums transition-all duration-200 ${
                                  isActiveMonth
                                    ? "text-foreground"
                                    : "text-foreground/80"
                                }`}
                              >
                                {String(count).padStart(2, "0")}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
              <div className="mt-5 rounded-xl border border-border/70 bg-muted/15 px-4 py-3 text-center text-sm text-muted-foreground">
                {monthlyWritingSummary.map((summary, index) => (
                  <span key={summary.label}>
                    {index > 0 && (
                      <span className="mx-2 text-muted-foreground/50">|</span>
                    )}
                    <span>{summary.label}: </span>
                    <span className="font-medium text-foreground">
                      {summary.count}
                    </span>
                  </span>
                ))}
              </div>
              {filteredBlogPosts.length > BLOG_POSTS_PER_PAGE && (
                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  {hasBlogFilters ? (
                    <button
                      type="button"
                      onClick={() =>
                        setBlogPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentBlogPage === 1}
                      aria-label="Previous page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:text-foreground hover:shadow-md hover:shadow-foreground/5 active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                    >
                      &lt;
                    </button>
                  ) : (
                    <a
                      href={getBlogPageHref(Math.max(1, currentBlogPage - 1))}
                      onClick={(event) => {
                        event.preventDefault();
                        handleBlogRoutePageChange(
                          Math.max(1, currentBlogPage - 1),
                        );
                      }}
                      aria-label="Previous page"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:text-foreground hover:shadow-md hover:shadow-foreground/5 active:translate-y-0 active:scale-95 ${
                        currentBlogPage === 1
                          ? "pointer-events-none opacity-40"
                          : ""
                      }`}
                    >
                      &lt;
                    </a>
                  )}
                  {Array.from({ length: totalBlogPages }, (_, pageIndex) => {
                    const page = pageIndex + 1;
                    const isActive = page === currentBlogPage;

                    const className = isActive
                      ? "flex h-9 w-9 items-center justify-center rounded-lg border border-foreground bg-foreground text-background shadow-md shadow-foreground/10 transition-all duration-150 ease-linear active:scale-95"
                      : "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:text-foreground hover:shadow-md hover:shadow-foreground/5 active:translate-y-0 active:scale-95";

                    return hasBlogFilters ? (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setBlogPage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={isActive ? "page" : undefined}
                        className={className}
                      >
                        {page}
                      </button>
                    ) : (
                      <a
                        key={page}
                        href={getBlogPageHref(page)}
                        onClick={(event) => {
                          event.preventDefault();
                          handleBlogRoutePageChange(page);
                        }}
                        aria-label={`Page ${page}`}
                        aria-current={isActive ? "page" : undefined}
                        className={className}
                      >
                        {page}
                      </a>
                    );
                  })}
                  {hasBlogFilters ? (
                    <button
                      type="button"
                      onClick={() =>
                        setBlogPage((page) =>
                          Math.min(totalBlogPages, page + 1),
                        )
                      }
                      disabled={currentBlogPage === totalBlogPages}
                      aria-label="Next page"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:text-foreground hover:shadow-md hover:shadow-foreground/5 active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                    >
                      &gt;
                    </button>
                  ) : (
                    <a
                      href={getBlogPageHref(
                        Math.min(totalBlogPages, currentBlogPage + 1),
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        handleBlogRoutePageChange(
                          Math.min(totalBlogPages, currentBlogPage + 1),
                        );
                      }}
                      aria-label="Next page"
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:text-foreground hover:shadow-md hover:shadow-foreground/5 active:translate-y-0 active:scale-95 ${
                        currentBlogPage === totalBlogPages
                          ? "pointer-events-none opacity-40"
                          : ""
                      }`}
                    >
                      &gt;
                    </a>
                  )}
                </div>
              )}
              {!hasBlogFilters &&
                filteredBlogPosts.length <= BLOG_POSTS_PER_PAGE && (
                  <p className="mt-6 text-sm text-muted-foreground/70 text-center">
                    {t.home.morePosts}
                  </p>
                )}
            </TabsContent>

            <TabsContent value="contact" className="tab-enter">
              <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                {t.home.contactTitle}
              </h2>
              <div className="grid gap-3">
                {t.contacts.map((contact) => (
                  <Link
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 active:translate-y-0 active:scale-[0.99]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/50 p-2 transition-all duration-150 ease-linear group-hover:bg-muted group-hover:scale-105">
                      <img
                        src={contact.icon}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {contact.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.value}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground/50 opacity-0 transition-all duration-150 ease-linear group-hover:translate-x-0.5 group-hover:text-muted-foreground group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SiteFooter
          tagline={t.home.footer}
          privacyHref={`${localePrefix}/privacy`}
        />
      </div>
    </main>
  );
}
