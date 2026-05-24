type MarkdownContentProps = {
  content: string;
};

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="space-y-7 text-[15px] leading-8 text-foreground/95 sm:text-base">
      {blocks.map((block, index) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="pt-3 text-xl font-semibold tracking-tight text-foreground"
            >
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="pt-4 text-2xl font-semibold tracking-tight text-foreground"
            >
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={index}
              className="pt-5 text-3xl font-bold tracking-tight text-foreground"
            >
              {trimmed.slice(2)}
            </h1>
          );
        }

        if (trimmed.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul
              key={index}
              className="list-disc space-y-3 rounded-lg border border-border/70 bg-muted/20 py-4 pl-8 pr-4"
            >
              {trimmed.split("\n").map((line) => (
                <li key={line}>{renderInlineMarkdown(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={index}
            className={
              index === 0
                ? "whitespace-pre-line text-lg leading-9 text-foreground"
                : "whitespace-pre-line"
            }
          >
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
