type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="space-y-5 text-sm leading-7 text-muted-foreground">
      {blocks.map((block, index) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-2 text-lg font-semibold text-foreground">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-3 text-xl font-semibold text-foreground">
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="pt-4 text-2xl font-bold text-foreground">
              {trimmed.slice(2)}
            </h1>
          );
        }

        if (trimmed.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {trimmed.split("\n").map((line) => (
                <li key={line}>{line.slice(2)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="whitespace-pre-line">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
