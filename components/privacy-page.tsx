"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/components/language-provider";
import { Language, translations } from "@/lib/i18n/index";

type PrivacyPageProps = {
  initialLanguage: Language;
};

export function PrivacyPage({ initialLanguage }: PrivacyPageProps) {
  const { language, setLanguage } = useLanguage();
  const t = translations[initialLanguage];
  const content = t.privacy;
  const localePrefix = `/${initialLanguage.toLowerCase()}`;

  useEffect(() => {
    if (language !== initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage, language, setLanguage]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-linear-to-br from-background via-background to-accent/20 pointer-events-none" />

      <div className="relative mx-auto max-w-2xl px-6 py-16 page-enter">
        <header className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Link
              href={localePrefix}
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {content.homeLabel}
            </Link>
            <LanguageToggle />
          </div>

          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {content.title}
          </h1>
          <p className="mt-3 text-xs text-muted-foreground/70">
            {content.updated}
          </p>
          <div className="mt-4 h-px bg-linear-to-r from-border via-muted-foreground/30 to-transparent" />
        </header>

        <article className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <p>{content.intro}</p>

          {content.sections.map((section) => (
            <section key={section.title} className="group">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground transition-transform duration-300 group-hover:scale-150" />
                {section.title}
              </h2>
              <div className="space-y-3 border-l-2 border-border pl-4 transition-colors duration-300 hover:border-muted-foreground/50">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <SiteFooter
          tagline={t.home.footer}
          privacyHref={`${localePrefix}/privacy`}
        />
      </div>
    </main>
  );
}
