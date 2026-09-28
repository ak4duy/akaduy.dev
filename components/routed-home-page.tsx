"use client";

import { useEffect, useState } from "react";
import { PortfolioPage } from "@/components/portfolio-page";
import { PortfolioShell } from "@/components/portfolio-shell";
import { BLOG_POSTS_PER_PAGE } from "@/lib/blog-config";
import type { BlogPostSummary } from "@/lib/blog-posts";
import { type Language, translations } from "@/lib/i18n";
import { localizedPath } from "@/lib/routes";
import styles from "@/styles/portfolio.module.css";

export type TabValue = "about" | "experience" | "blog" | "contact";

type RoutedHomePageProps = {
  activeTab: TabValue;
  blogPosts: BlogPostSummary[];
  initialLanguage: Language;
  initialBlogPage?: number;
};

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
  const match = date.match(/^\d{2}-(\d{2})-(\d{4})$/);
  return match ? `${match[2]}-${match[1]}` : null;
}

function getCalendarMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(month: string, language: Language) {
  const [year, number] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(language === "VN" ? "vi-VN" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, number - 1, 1));
}

export function RoutedHomePage(props: RoutedHomePageProps) {
  return props.activeTab === "blog"
    ? <BlogIndexPage {...props} />
    : <PortfolioPage {...props} activeTab={props.activeTab} />;
}

function BlogIndexPage({
  blogPosts,
  initialLanguage,
  initialBlogPage = 1,
}: RoutedHomePageProps) {
  const t = translations[initialLanguage];
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [month, setMonth] = useState("");
  const [filteredPage, setFilteredPage] = useState(1);
  const [today, setToday] = useState<Date | null>(null);
  // Calendar counts depend on the visitor's date, not the static build date.
  useEffect(() => setToday(new Date()), []);

  const tags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)))
    .sort((a, b) => a.localeCompare(b));
  const monthCounts = new Map<string, number>();
  for (const post of blogPosts) {
    const key = getBlogMonthKey(post.date);
    if (key) monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
  }
  const months = Array.from(monthCounts).sort(([a], [b]) => b.localeCompare(a));
  const normalizedSearch = normalizeSearchText(search);
  const hasFilters = Boolean(normalizedSearch || tag || month);
  const filteredPosts = blogPosts.filter((post) =>
    (!normalizedSearch || normalizeSearchText(
      [post.title, post.excerpt, post.date, ...post.tags].join(" "),
    ).includes(normalizedSearch)) &&
    (!tag || post.tags.includes(tag)) &&
    (!month || getBlogMonthKey(post.date) === month),
  );
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / BLOG_POSTS_PER_PAGE));
  const currentPage = Math.min(hasFilters ? filteredPage : initialBlogPage, pageCount);
  const posts = filteredPosts.slice(
    (currentPage - 1) * BLOG_POSTS_PER_PAGE,
    currentPage * BLOG_POSTS_PER_PAGE,
  );
  const pageHref = (page: number) =>
    localizedPath(initialLanguage, page === 1 ? "blog" : `blog/${page}`);

  function clearFilters() {
    setSearch("");
    setTag("");
    setMonth("");
    setFilteredPage(1);
  }

  return (
    <PortfolioShell activeTab="blog" language={initialLanguage}>
      <div className={styles.blogIntro}>
        <div>
          <h1>{t.nav.blog}</h1>
          <p className={styles.lead}>{t.portfolio.blogIntro}</p>
        </div>
      </div>

      <section aria-label={t.home.blogPostsTitle}>
        <div className={styles.filterPanel}>
          <label className={styles.search}>
            <input
              type="search"
              value={search}
              placeholder={t.blog.searchPlaceholder}
              aria-label={t.blog.searchPlaceholder}
              onChange={(event) => { setSearch(event.target.value); setFilteredPage(1); }}
            />
          </label>
          <div className={styles.filterSelects}>
            <label>
              <span>{t.blog.tagFilterLabel}</span>
              <select value={tag} onChange={(event) => { setTag(event.target.value); setFilteredPage(1); }}>
                <option value="">{t.blog.allTags}</option>
                {tags.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>{t.blog.archive}</span>
              <select value={month} onChange={(event) => { setMonth(event.target.value); setFilteredPage(1); }}>
                <option value="">{t.portfolio.allMonths}</option>
                {months.map(([key, count]) => (
                  <option key={key} value={key}>{formatMonth(key, initialLanguage)} ({count})</option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.archiveSummary}>
            <span aria-live="polite">{t.home.blogPostsTitle}: {filteredPosts.length}</span>
            {hasFilters ? (
              <button type="button" onClick={clearFilters}>{t.portfolio.resetFilters}</button>
            ) : today && (
              <span>
                {t.blog.thisMonth}: {monthCounts.get(getCalendarMonthKey(today)) ?? 0}
                {" · "}{t.blog.lastMonth}: {monthCounts.get(getCalendarMonthKey(new Date(today.getFullYear(), today.getMonth() - 1, 1))) ?? 0}
              </span>
            )}
          </div>
        </div>

        <div className={styles.listPanel}>
          {posts.map((post) => (
            <a className={styles.post} key={post.slug} href={localizedPath(initialLanguage, `blog/${post.slug}`)}>
              <div className={styles.postMeta}>
                <span className={styles.date}>{post.date}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div>
                <div className={styles.postTags}>{post.tags.map((value) => <span key={value}>{value}</span>)}</div>
              </div>
            </a>
          ))}
          {posts.length === 0 && (
            <div className={styles.emptyState}>
              <p>{t.blog.noSearchResults}</p>
              <button type="button" className={styles.textLink} onClick={clearFilters}>{t.portfolio.resetFilters}</button>
            </div>
          )}
        </div>

        {pageCount > 1 && (
          <nav className={styles.pagination} aria-label={t.portfolio.pagination}>
            {hasFilters ? (
              <button type="button" disabled={currentPage === 1} onClick={() => setFilteredPage(currentPage - 1)}>{t.portfolio.previousPage}</button>
            ) : currentPage > 1 && (
              <a href={pageHref(currentPage - 1)}>{t.portfolio.previousPage}</a>
            )}
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) =>
              hasFilters ? (
                <button type="button" key={page} aria-current={page === currentPage ? "page" : undefined} onClick={() => setFilteredPage(page)}>{page}</button>
              ) : (
                <a key={page} href={pageHref(page)} aria-current={page === currentPage ? "page" : undefined}>{page}</a>
              ),
            )}
            {hasFilters ? (
              <button type="button" disabled={currentPage === pageCount} onClick={() => setFilteredPage(currentPage + 1)}>{t.portfolio.nextPage}</button>
            ) : currentPage < pageCount && (
              <a href={pageHref(currentPage + 1)}>{t.portfolio.nextPage}</a>
            )}
          </nav>
        )}
        {!hasFilters && blogPosts.length <= BLOG_POSTS_PER_PAGE && <p className={styles.endNote}>{t.home.morePosts}</p>}
      </section>
    </PortfolioShell>
  );
}
