"use client";

import { languages, type Language } from "@/lib/i18n/index";

export function LanguageToggle({ language }: { language: Language }) {
  const activeLanguage = language;

  const handleLanguageChange = (nextLanguage: typeof language) => {
    try {
      window.localStorage.setItem("language", nextLanguage);
    } catch {}

    const pathWithoutLocale = window.location.pathname.replace(/^\/(en|vn)(?=\/|$)/, "") || "";
    const nextPrefix = nextLanguage.toLowerCase();

    window.location.assign(`/${nextPrefix}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 text-sm">
      {languages.map((option, index) => (
        <div key={option} className="flex items-center gap-1">
          {index > 0 && <span className="text-muted-foreground/50">|</span>}
          <button
            type="button"
            onClick={() => handleLanguageChange(option)}
            className={`rounded-md px-2.5 py-1 font-medium transition-all duration-150 ease-linear hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
              activeLanguage === option
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={activeLanguage === option}
          >
            {option}
          </button>
        </div>
      ))}
    </div>
  );
}
