import { navigate } from "astro:transitions/client";
import { prefetch } from "astro:prefetch";
import { languages, type Language } from "@/lib/i18n/index";
import { localizedPath } from "@/lib/routes";

export function LanguageToggle({ language }: { language: Language }) {
  const getLanguagePath = (nextLanguage: Language) => {
    const { pathname, search, hash } = window.location;
    const route = pathname.replace(/^\/(en|vn)(?=\/|$)/, "");
    return `${localizedPath(nextLanguage, route)}${search}${hash}`;
  };

  const prefetchLanguage = (nextLanguage: Language) => {
    if (nextLanguage !== language) prefetch(getLanguagePath(nextLanguage));
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    if (nextLanguage === language) return;

    navigate(getLanguagePath(nextLanguage), {
      history: "replace",
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 text-sm">
      {languages.map((option, index) => (
        <div key={option} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-muted-foreground/50">|</span>
          )}

          <button
            type="button"
            onClick={() => handleLanguageChange(option)}
            onMouseEnter={() => prefetchLanguage(option)}
            onFocus={() => prefetchLanguage(option)}
            onTouchStart={() => prefetchLanguage(option)}
            className={`rounded-md px-2.5 py-1 font-medium transition-all duration-150 ease-linear hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
              language === option
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={language === option}
          >
            {option}
          </button>
        </div>
      ))}
    </div>
  );
}
