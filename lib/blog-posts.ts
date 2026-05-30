import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import type { Metadata } from "next";
import { BLOG_POSTS_PER_PAGE } from "@/lib/blog-config";
import { Language } from "@/lib/i18n/index";

export type BlogPollOption = {
  id: string;
  label: string;
};

export type BlogPoll = {
  id: string;
  question: string;
  options: BlogPollOption[];
};

export type BlogPostStyle = "normal" | "novel";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  draft: boolean;
  style: BlogPostStyle;
  poll: BlogPoll | null;
};

const languageDirectory: Record<Language, string> = {
  EN: "en",
  VN: "vn",
};

function getBlogPostDirectory(language: Language) {
  return join(
    process.cwd(),
    "content",
    "blog-posts",
    languageDirectory[language],
  );
}

function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: {} as Record<string, string | string[] | boolean>,
      content: markdown.trim(),
    };
  }

  const frontmatter: Record<string, string | string[] | boolean> = {};
  const lines = match[1].split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (!keyValue) {
      continue;
    }

    const [, key, rawValue] = keyValue;

    if (rawValue === "") {
      const values: string[] = [];

      while (lines[i + 1]?.match(/^\s+-\s+/)) {
        i++;
        values.push(
          lines[i].replace(/^\s+-\s+/, "").replace(/^['\"]|['\"]$/g, ""),
        );
      }

      frontmatter[key] = values;
    } else {
      const value = rawValue.replace(/^['\"]|['\"]$/g, "");
      frontmatter[key] =
        value === "true" ? true : value === "false" ? false : value;
    }
  }

  return {
    frontmatter,
    content: match[2].trim(),
  };
}

function createPollOptionId(label: string) {
  return (
    label
      .toLowerCase()
      .normalize("NFD")
      .replace(/đ/g, "d")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "option"
  );
}

function createBlogPoll(
  slug: string,
  frontmatter: Record<string, string | string[] | boolean>,
): BlogPoll | null {
  const question = frontmatter.pollQuestion;
  const options = frontmatter.pollOptions;
  const optionIds = frontmatter.pollOptionIds;

  if (typeof question !== "string" || !Array.isArray(options)) {
    return null;
  }

  return {
    id: String(frontmatter.pollId ?? slug),
    question,
    options: options.map((label, index) => ({
      id:
        Array.isArray(optionIds) && typeof optionIds[index] === "string"
          ? createPollOptionId(optionIds[index])
          : createPollOptionId(label),
      label,
    })),
  };
}

function normalizeBlogPostStyle(value: unknown): BlogPostStyle {
  return value === "novel" ? "novel" : "normal";
}

function createExcerpt(content: string) {
  return (
    content
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find(Boolean) ?? ""
  );
}

export function getBlogPost(language: Language, slug: string): BlogPost {
  const filePath = join(getBlogPostDirectory(language), `${slug}.md`);
  const markdown = readFileSync(filePath, "utf8");
  const { frontmatter, content } = parseFrontmatter(markdown);

  return {
    slug,
    title: String(frontmatter.title ?? slug),
    date: String(frontmatter.date ?? ""),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    excerpt: String(frontmatter.excerpt ?? createExcerpt(content)),
    content,
    draft: frontmatter.draft === true,
    style: normalizeBlogPostStyle(frontmatter.style),
    poll: createBlogPoll(slug, frontmatter),
  };
}

export function getBlogPosts(language: Language) {
  return readdirSync(getBlogPostDirectory(language))
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => getBlogPost(language, basename(fileName, ".md")))
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPageCount(language: Language) {
  return Math.max(
    1,
    Math.ceil(getBlogPosts(language).length / BLOG_POSTS_PER_PAGE),
  );
}

export function createBlogPostMetadata(post: BlogPost): Metadata {
  const title = `Blog: ${post.title} | ak4duy`;
  const description = post.excerpt;

  return {
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      siteName: "ak4duy blog",
      type: "article",
      tags: post.tags,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
