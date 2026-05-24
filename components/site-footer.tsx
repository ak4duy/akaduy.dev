type SiteFooterProps = {
  tagline: string;
};

export function SiteFooter({ tagline }: SiteFooterProps) {
  const prefix = "|";
  return (
    <footer className="mt-20 text-center">
      <div className="h-px bg-linear-to-r from-transparent via-border to-transparent mb-6" />
      <p className="mb-4 text-xs italic text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-300">
        {tagline}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <a
          href="https://github.com/ak4duy/yud-on.top"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:text-foreground active:translate-y-0 active:scale-95"
        >
          <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-sm bg-background">
            <img
              src="/contact-icons/github.svg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-contain"
            />
          </span>
          Source
        </a>
        <span className="text-muted-foreground/40">{prefix}</span>
        <a
          href="https://buymeacoffee.com/akaduy"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:text-foreground active:translate-y-0 active:scale-95"
        >
          Donate
        </a>
        <span className="text-muted-foreground/40">{prefix}</span>
        <span>© 2026 ak4duy</span>
      </div>
    </footer>
  );
}
