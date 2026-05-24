"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Mail, MessageCircle, Key, ExternalLink } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { BlogPost } from "@/lib/blog-posts";
import { Language, translations } from "@/lib/i18n";

const tools = ["Java", "Rust", "Python", "Linux"];
const interests = ["TypeScript", "JavaScript", "Kotlin", "Go"];
const contactIcons = {
  github: Github,
  discord: MessageCircle,
  mail: Mail,
  key: Key,
};

export type TabValue = "about" | "experience" | "blog" | "contact";

type RoutedHomePageProps = {
  activeTab: TabValue;
  blogPosts: BlogPost[];
  initialLanguage?: Language;
};

export function RoutedHomePage({
  activeTab,
  blogPosts,
  initialLanguage,
}: RoutedHomePageProps) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const activeLanguage = initialLanguage ?? language;
  const t = translations[activeLanguage];
  const localePrefix = initialLanguage
    ? `/${initialLanguage.toLowerCase()}`
    : "";
  const tabs = [
    { value: "about", label: t.nav.about, href: localePrefix || "/" },
    {
      value: "experience",
      label: t.nav.experience,
      href: `${localePrefix}/experience`,
    },
    { value: "blog", label: t.nav.blog, href: `${localePrefix}/blog` },
    { value: "contact", label: t.nav.contact, href: `${localePrefix}/contact` },
  ] as const;

  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage, language, setLanguage]);

  const handleTabChange = (value: string) => {
    const tab = tabs.find((tab) => tab.value === value);

    if (tab) {
      router.push(tab.href);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/20 pointer-events-none" />

      <div className="relative mx-auto max-w-2xl px-6 py-16">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-end mb-4">
            <LanguageToggle />
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            ak4duy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {t.home.intro}
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-border via-muted-foreground/30 to-transparent" />
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-8 w-full justify-start gap-2 bg-transparent p-0 border-b border-border">
              {tabs.map((tab, i) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value="about"
              className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  {t.home.backgroundTitle}
                </h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground pl-4 border-l-2 border-border hover:border-muted-foreground/50 transition-colors duration-300">
                  {t.home.background.map((paragraph, i) => (
                    <p
                      key={paragraph}
                      className="animate-in fade-in duration-500 whitespace-pre-line"
                      style={{ animationDelay: `${(i + 1) * 100}ms` }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>

              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  {t.home.languagesTitle}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {tools.map((tool, i) => (
                    <span
                      key={tool}
                      className="rounded-lg bg-muted/50 border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105 transition-all duration-300 cursor-default animate-in fade-in zoom-in-95"
                      style={{ animationDelay: `${i * 100 + 300}ms` }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  {t.home.interestedTitle}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest, i) => (
                    <span
                      key={interest}
                      className="rounded-lg bg-muted/50 border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105 transition-all duration-300 cursor-default animate-in fade-in zoom-in-95"
                      style={{ animationDelay: `${i * 100 + 500}ms` }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent
              value="experience"
              className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <section>
                <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  {t.home.projectsTitle}
                </h2>
                <div className="space-y-4">
                  {t.projects.map((project, i) => (
                    <div
                      key={project.name}
                      className="group rounded-xl border border-border bg-card/50 p-5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <Link
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all duration-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {project.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted/50 border border-border px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  {t.home.educationTitle}
                </h2>
                <div className="group rounded-xl border border-border bg-card/50 p-5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 delay-100">
                  <h3 className="font-semibold text-foreground">
                    {t.home.university}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t.home.universityDescription}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    {t.home.ongoing}
                  </span>
                </div>
              </section>
            </TabsContent>

            <TabsContent
              value="blog"
              className="animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                {t.home.blogPostsTitle}
              </h2>
              <div className="space-y-4">
                {blogPosts.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={`${localePrefix || `/${language.toLowerCase()}`}/blog/${post.slug}`}
                    className="block group rounded-xl border border-border bg-card/50 p-5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <span className="text-xs text-muted-foreground/70">
                        {post.date}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted/50 border border-border px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground/70 text-center">
                {t.home.morePosts}
              </p>
            </TabsContent>

            <TabsContent
              value="contact"
              className="animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                {t.home.contactTitle}
              </h2>
              <div className="grid gap-3">
                {t.contacts.map((contact, i) => {
                  const Icon = contactIcons[contact.icon];

                  return (
                    <Link
                      key={contact.label}
                      href={contact.href}
                      target={contact.external ? "_blank" : undefined}
                      rel={contact.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-all duration-300 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 hover:translate-x-1 animate-in fade-in slide-in-from-left-4"
                      style={{ animationDelay: `${i * 75}ms` }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-muted group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {contact.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {contact.value}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <footer className="mt-20 text-center animate-in fade-in duration-700 delay-500">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
          <p className="text-xs italic text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-300">
            {t.home.footer}
          </p>
        </footer>
      </div>
    </main>
  );
}
