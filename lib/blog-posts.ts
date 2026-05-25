import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import type { Metadata } from "next";
import { Language } from "@/lib/i18n";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
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
      frontmatter: {} as Record<string, string | string[]>,
      content: markdown.trim(),
    };
  }

  const frontmatter: Record<string, string | string[]> = {};
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
      frontmatter[key] = rawValue.replace(/^['\"]|['\"]$/g, "");
    }
  }

  return {
    frontmatter,
    content: match[2].trim(),
  };
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
  };
}

export function getBlogPosts(language: Language) {
  return readdirSync(getBlogPostDirectory(language))
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => getBlogPost(language, basename(fileName, ".md")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function createBlogPostMetadata(post: BlogPost): Metadata {
  return {
    title: `Blog: ${post.title} | ak4duy`,
    description: post.excerpt,
  };
}
