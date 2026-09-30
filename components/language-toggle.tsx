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

          <a
            suppressHydrationWarning
            href={localizedPath(option, language === option ? path : alternatePath)}
            hrefLang={option === "VN" ? "vi" : "en"}
            data-language-path={localizedPath(option, language === option ? path : alternatePath)}
            data-astro-history="replace"
            data-astro-prefetch={language === option ? "false" : "load"}
            className={`rounded-md px-2.5 py-1 font-medium transition-all duration-150 ease-linear hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
              language === option
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-current={language === option ? "page" : undefined}
          >
            {option}
          </a>
        </div>
      ))}
    </div>
  );
}
