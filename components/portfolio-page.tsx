import { CurrentWorkStatus } from "@/components/current-work-status";
import { PortfolioShell } from "@/components/portfolio-shell";
import type { BlogPostSummary } from "@/lib/blog-posts";
import { translations, type Language, type Translation } from "@/lib/i18n";
import { featuredProjectHrefs, projectCreationDates } from "@/lib/portfolio-config";
import { localizedPath } from "@/lib/routes";
import styles from "@/styles/portfolio.module.css";

type PortfolioPageProps = {
  activeTab: "about" | "experience" | "contact";
  initialLanguage: Language;
  blogPosts: BlogPostSummary[];
};

function ProjectList({
  items,
}: {
  items: Translation["experience"]["projects"];
}) {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });

  return (
    <div>
      {items.map((item) => {
        const createdOn = projectCreationDates[item.href];
        return (
          <article className={styles.project} key={item.href}>
            <a
              className={styles.projectDetails}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>{item.name}</h3>
              <div className={styles.description}>
                {item.description.map((line) => <p key={line}>{line}</p>)}
              </div>
              <p className={styles.tags}>
                <span>{item.tags.join(" / ")}</span>
                {createdOn && (
                  <time dateTime={createdOn}>{dateFormatter.format(new Date(createdOn)).replaceAll("/", "-")}</time>
                )}
              </p>
            </a>
          </article>
        );
      })}
    </div>
  );
}

export function PortfolioPage({
  activeTab,
  initialLanguage,
  blogPosts,
}: PortfolioPageProps) {
  const t = translations[initialLanguage];
  const experienceItems = [
    ...t.experience.workingOn,
    ...t.experience.projects,
    ...t.experience.tools,
    ...t.experience.contributedTo,
  ];
  const featuredProjects = featuredProjectHrefs.map((href) => {
    const project = experienceItems.find((item) => item.href === href);
    if (!project) {
      throw new Error(`Featured project not found in ${initialLanguage}: ${href}`);
    }
    return project;
  });

  return (
    <PortfolioShell activeTab={activeTab} language={initialLanguage}>
          {activeTab === "about" ? (
            <>
              <section className={styles.notebook}>
                  <div className={styles.sectionHeading}>
                    <h2>{t.home.backgroundTitle}</h2>
                  </div>
                  {t.home.background.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  <div className={styles.toolkit}>
                    <h2>{t.home.languagesTitle}</h2>
                    <p>Java / Rust / Python / Linux</p>
                    <h2>{t.home.interestedTitle}</h2>
                    <p>TypeScript / JavaScript / Kotlin / Go</p>
                  </div>
                  <div className={styles.heroLinks}>
                    <a className={styles.primaryLink} href="#selected-work">
                      {t.home.projectsTitle}
                    </a>
                    <a className={styles.textLink} href={localizedPath(initialLanguage, "contact")}>
                      {t.home.contactTitle}
                    </a>
                  </div>
              </section>

              <section className={styles.section} id="selected-work" aria-labelledby="work-heading">
                <div className={styles.sectionHeading}>
                  <div>
                    <h2 id="work-heading">{t.portfolio.selectedWork}</h2>
                  </div>
                  <a className={styles.textLink} href={localizedPath(initialLanguage, "experience")}>
                    {t.portfolio.viewAll}
                  </a>
                </div>
                <div className={styles.workStatus}>
                  <CurrentWorkStatus label={t.home.currentlyWorkingOn} />
                </div>
                <ProjectList items={featuredProjects} />
              </section>

              <section className={styles.section} aria-labelledby="writing-heading">
                <div className={styles.sectionHeading}>
                  <div>
                    <h2 id="writing-heading">{t.portfolio.recentWriting}</h2>
                  </div>
                  <a className={styles.textLink} href={localizedPath(initialLanguage, "blog")}>
                    {t.portfolio.viewAll}
                  </a>
                </div>
                <div>
                  {blogPosts.slice(0, 3).map((post) => (
                    <a className={styles.writing} key={post.slug} href={localizedPath(initialLanguage, `blog/${post.slug}`)}>
                      <span className={styles.date}>{post.date}</span>
                      <div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                      </div>
                    </a>
                  ))}
                  {blogPosts.length === 0 && <p className={styles.lead}>{t.home.morePosts}</p>}
                </div>
              </section>
            </>
          ) : activeTab === "experience" ? (
            <>
              <div className={styles.pageIntro}>
                <p className={styles.eyebrow}>akaduy / {t.nav.experience}</p>
                <h1>{t.home.projectsTitle}</h1>
                <p className={styles.lead}>{t.portfolio.experienceIntro}</p>
                <CurrentWorkStatus label={t.home.currentlyWorkingOn} />
              </div>
              {[
                { title: t.experience.workingOnTitle, items: t.experience.workingOn },
                { title: t.experience.projectsTitle, items: t.experience.projects },
                { title: t.experience.toolsTitle, items: t.experience.tools },
                { title: t.experience.contributedToTitle, items: t.experience.contributedTo },
              ].map((section) => (
                <section className={styles.section} key={section.title}>
                  <div className={styles.sectionHeading}>
                    <h2>{section.title}</h2>
                  </div>
                  <ProjectList items={section.items} />
                </section>
              ))}
            </>
          ) : (
            <>
              <div className={styles.pageIntro}>
                <p className={styles.eyebrow}>akaduy / {t.nav.contact}</p>
                <h1>{t.home.contactTitle}</h1>
                <p className={styles.lead}>{t.portfolio.contactIntro}</p>
              </div>
              <div className={styles.listPanel}>
                {t.contacts.map((contact) => (
                  <a
                    className={styles.contact}
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noopener noreferrer" : undefined}
                  >
                    <img src={contact.icon} alt="" width={24} height={24} />
                    <div>
                      <h2>{contact.label}</h2>
                      <p>{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
    </PortfolioShell>
  );
}
