"use client";

import { usePathname, useRouter } from "next/navigation";
import { languages } from "@/lib/i18n";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const activeLanguage = pathname.startsWith("/vn")
    ? "VN"
    : pathname.startsWith("/en")
      ? "EN"
      : language;

  const handleLanguageChange = (nextLanguage: typeof language) => {
    setLanguage(nextLanguage);

    const pathWithoutLocale = pathname.replace(/^\/(en|vn)(?=\/|$)/, "") || "";
    const nextPrefix = nextLanguage.toLowerCase();

    router.push(`/${nextPrefix}${pathWithoutLocale}`);
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
