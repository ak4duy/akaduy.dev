"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

type MarkdownContentProps = {
  content: string;
  contentsLabel?: string;
  stickyBackHref?: string;
  stickyBackLabel?: string;
  afterFirstRule?: ReactNode;
};

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string; id: string }
  | { type: "paragraph"; lines: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "image"; alt: string; src: string }
  | { type: "rule" };

type HeadingBlock = Extract<MarkdownBlock, { type: "heading" }>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/đ/g, "d") //special vnese case
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(
    /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g,
  );

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (link) {
      return (
        <a
          key={index}
          href={link[2]}
          target={link[2].startsWith("http") ? "_blank" : undefined}
          rel={link[2].startsWith("http") ? "noopener noreferrer" : undefined}
          className="font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          {link[1]}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-foreground/95">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded-md border border-border bg-muted/70 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.trim().split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  const headingCounts = new Map<string, number>();
  let paragraph: string[] = [];
  let quote: string[] = [];
  let unorderedList: string[] = [];
  let orderedList: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", lines: paragraph });
      paragraph = [];
    }
  };

  const flushQuote = () => {
    if (quote.length > 0) {
      blocks.push({ type: "quote", lines: quote });
      quote = [];
    }
  };

  const flushUnorderedList = () => {
    if (unorderedList.length > 0) {
      blocks.push({ type: "unordered-list", items: unorderedList });
      unorderedList = [];
    }
  };

  const flushOrderedList = () => {
    if (orderedList.length > 0) {
      blocks.push({ type: "ordered-list", items: orderedList });
      orderedList = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushQuote();
    flushUnorderedList();
    flushOrderedList();
  };

  const createHeadingId = (text: string) => {
    const baseId = slugify(text) || "section";
    const count = headingCounts.get(baseId) ?? 0;
    headingCounts.set(baseId, count + 1);

    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushAll();
      const text = heading[2];
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        text,
        id: createHeadingId(text),
      });
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      flushAll();
      blocks.push({ type: "rule" });
      continue;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      flushUnorderedList();
      flushOrderedList();
      quote.push(trimmed.replace(/^>\s?/, ""));
      continue;
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushAll();
      blocks.push({
        type: "image",
        alt: image[1],
        src: image[2],
      });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph();
      flushQuote();
      flushOrderedList();
      unorderedList.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      flushQuote();
      flushUnorderedList();
      orderedList.push(trimmed.replace(/^\d+\.\s+/, ""));
      continue;
    }

    flushQuote();
    flushUnorderedList();
    flushOrderedList();
    paragraph.push(trimmed);
  }

  flushAll();
  return blocks;
}

function StickyBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex w-fit items-center gap-2 rounded-xl border border-border/80 bg-background/85 px-3 py-2 text-sm text-muted-foreground shadow-xl shadow-black/10 backdrop-blur transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </Link>
  );
}

function TableOfContents({
  headings,
  variant = "inline",
  visible = true,
  label = "Contents",
  activeHeadingId,
}: {
  headings: HeadingBlock[];
  variant?: "inline" | "sticky-note";
  visible?: boolean;
  label?: string;
  activeHeadingId?: string | null;
}) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={
        variant === "sticky-note"
          ? "max-h-[calc(100vh-12rem)] overflow-y-auto rounded-2xl border border-border/80 bg-background/85 p-4 text-sm shadow-xl shadow-black/10 backdrop-blur"
          : "rounded-2xl border border-border/80 bg-muted/20 p-4 text-sm"
      }
      aria-label="Table of contents"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <ol className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level > 1 ? "ml-4" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className={`block truncate transition-colors hover:text-foreground ${
                activeHeadingId === heading.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
              title={heading.text}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Heading({ level, text, id }: HeadingBlock) {
  const content = renderInlineMarkdown(text);
  const anchor = (
    <a
      href={`#${id}`}
      aria-label={`Link to ${text}`}
      className="absolute -left-6 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
    >
      #
    </a>
  );

  if (level === 1) {
    return (
      <h2
        id={id}
        className="group relative scroll-mt-24 mt-10 border-b border-border/70 pb-3 text-2xl font-bold tracking-tight text-foreground first:mt-0 sm:text-3xl"
      >
        {anchor}
        {content}
      </h2>
    );
  }

  if (level === 2) {
    return (
      <h3
        id={id}
        className="group relative scroll-mt-24 mt-8 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      >
        {anchor}
        {content}
      </h3>
    );
  }

  return (
    <h4
      id={id}
      className="group relative scroll-mt-24 mt-6 text-lg font-semibold tracking-tight text-foreground"
    >
      {anchor}
      {content}
    </h4>
  );
}

export function MarkdownContent({
  content,
  contentsLabel = "Contents",
  stickyBackHref,
  stickyBackLabel,
  afterFirstRule,
}: MarkdownContentProps) {
  const [showStickyContents, setShowStickyContents] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const contentsRef = useRef<HTMLDivElement | null>(null);
  const blocks = parseMarkdown(content);
  const headings = blocks.filter(
    (block): block is HeadingBlock => block.type === "heading",
  );

  useEffect(() => {
    const contents = contentsRef.current;

    if (!contents) {
      return;
    }

    const updateStickyContents = () => {
      const shouldShowStickyContents =
        contents.getBoundingClientRect().bottom <= 0;
      setShowStickyContents(shouldShowStickyContents);

      const activeHeading = headings
        .map((heading) => document.getElementById(heading.id))
        .filter((heading): heading is HTMLElement => Boolean(heading))
        .filter((heading) => heading.getBoundingClientRect().top <= 120)
        .at(-1);

      setActiveHeadingId(activeHeading?.id ?? null);
    };

    updateStickyContents();
    window.addEventListener("scroll", updateStickyContents, { passive: true });
    window.addEventListener("resize", updateStickyContents);

    return () => {
      window.removeEventListener("scroll", updateStickyContents);
      window.removeEventListener("resize", updateStickyContents);
    };
  }, [headings]);

  return (
    <div className="relative text-[15px] leading-8 text-foreground/95 sm:text-base">
      {showStickyContents && (
        <div className="sticky top-28 -ml-96 z-40 hidden w-56 animate-in fade-in slide-in-from-left-2 duration-300 xl:block 2xl:left-[max(2rem,calc((100vw-48rem)/2-18rem))] 2xl:w-64">
          {stickyBackHref && stickyBackLabel && (
            <div className="mb-4 flex justify-end">
              <StickyBackLink href={stickyBackHref} label={stickyBackLabel} />
            </div>
          )}
          <TableOfContents
            headings={headings}
            variant="sticky-note"
            label={contentsLabel}
            activeHeadingId={activeHeadingId}
          />
        </div>
      )}

      <div ref={contentsRef} className="mb-8">
        <TableOfContents headings={headings} label={contentsLabel} />
      </div>

      <div className="min-w-0 space-y-4">
        {blocks.map((block, index) => {
          if (block.type === "heading") {
            return <Heading key={index} {...block} />;
          }

          if (block.type === "rule") {
            const hasPreviousRule = blocks
              .slice(0, index)
              .some((previousBlock) => previousBlock.type === "rule");

            return (
              <div key={index}>
                <hr className="my-8 border-border/80" />
                {!hasPreviousRule && afterFirstRule}
              </div>
            );
          }

          if (block.type === "image") {
            return (
              <figure
                key={index}
                className="overflow-hidden rounded-xl border border-border/70 bg-muted/10"
              >
                <img
                  src={block.src}
                  alt={block.alt || "Blog image"}
                  className="h-auto w-full"
                  loading="lazy"
                />
                {block.alt && (
                  <figcaption className="border-t border-border/70 px-3 py-2 text-xs text-muted-foreground">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === "quote") {
            return (
              <blockquote
                key={index}
                className="rounded-r-xl border-l-4 border-foreground/70 bg-muted/30 px-5 py-4 text-foreground/90 shadow-sm"
              >
                <div className="space-y-3 italic">
                  {block.lines.map((line, lineIndex) => (
                    <p key={`${line}-${lineIndex}`}>
                      {renderInlineMarkdown(line)}
                    </p>
                  ))}
                </div>
              </blockquote>
            );
          }

          if (block.type === "unordered-list") {
            return (
              <ul
                key={index}
                className="list-disc space-y-3 rounded-xl border border-border/70 bg-muted/20 py-4 pl-8 pr-4"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );
          }

          if (block.type === "ordered-list") {
            return (
              <ol
                key={index}
                className="list-decimal space-y-3 rounded-xl border border-border/70 bg-muted/20 py-4 pl-8 pr-4"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>
                    {renderInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );
          }

          return (
            <p
              key={index}
              className={
                index === 0
                  ? "text-lg leading-9 text-foreground"
                  : "text-foreground/95"
              }
            >
              {block.lines.map((line, lineIndex) => (
                <span key={`${line}-${lineIndex}`}>
                  {lineIndex > 0 && <br />}
                  {renderInlineMarkdown(line)}
                </span>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}
