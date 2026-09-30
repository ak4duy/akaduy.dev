import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { SiteFooter } from "@/components/site-footer";
import { translations, type Language } from "@/lib/i18n";
import { localizedPath } from "@/lib/routes";
import styles from "@/styles/portfolio.module.css";

export function PortfolioShell({
  activeTab,
  language,
  children,
}: {
  activeTab: "about" | "experience" | "blog" | "contact";
  language: Language;
  children: ReactNode;
}) {
  const t = translations[language];
  const tabs = [
    { value: "about", label: t.nav.about, href: localizedPath(language) },
    { value: "experience", label: t.nav.experience, href: localizedPath(language, "experience") },
    { value: "blog", label: t.nav.blog, href: localizedPath(language, "blog") },
    { value: "contact", label: t.nav.contact, href: localizedPath(language, "contact") },
  ];

  return (
    <div className={styles.portfolio}>
      <a className={styles.skipLink} href="#main-content">{t.portfolio.skipToContent}</a>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.masthead}>
            <a className={styles.wordmark} href={localizedPath(language)} aria-label="akaduy.dev">
              <span>akaduy<span className={styles.domain}>.dev</span></span>
            </a>
            <LanguageToggle language={language} />
          </div>
          <nav className={styles.navigation} aria-label={t.portfolio.navigation}>
            {tabs.map(({ value, label, href }) => (
              <a key={value} href={href} aria-current={activeTab === value ? "page" : undefined}>
                {label}
              </a>
            ))}
          </nav>
        </header>
        <main id="main-content" className={styles.content} tabIndex={-1}>{children}</main>
        <SiteFooter tagline={t.home.footer} privacyHref={localizedPath(language, "privacy")} showIcon={false} />
      </div>
    </div>
  );
}
