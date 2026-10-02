import { languages, type Language } from "@/lib/i18n/index";
import { localizedPath } from "@/lib/routes";

export function LanguageToggle({
  language,
  path,
  alternatePath = path,
}: {
  language: Language;
  path: string;
  alternatePath?: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 text-sm">
      {languages.map((option, index) => (
        <div key={option} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-muted-foreground/50">|</span>
          )}

          {language === option ? (
            <span
              className="rounded-md bg-foreground px-2.5 py-1 font-medium text-background"
              aria-current="page"
            >
              {option}
            </span>
          ) : (
            <a
              suppressHydrationWarning
              href={localizedPath(option, alternatePath)}
              hrefLang={option === "VN" ? "vi" : "en"}
              data-language-path={localizedPath(option, alternatePath)}
              data-astro-history="replace"
              data-astro-prefetch="load"
              className="rounded-md px-2.5 py-1 font-medium text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:text-foreground active:translate-y-0 active:scale-95"
            >
              {option}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
