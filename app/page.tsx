"use client";

import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Mail, MessageCircle, Key, ExternalLink } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-accent/20 pointer-events-none" />

      <div className="relative mx-auto max-w-2xl px-6 py-16">
        {/* Header with fade-in animation */}
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            ak4duy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Self-taught developer. Currently working with J*va, Python, Rust,
            and whatever breaks next.
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-border via-muted-foreground/30 to-transparent" />
        </header>

        {/* Tabs with staggered animation */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-8 w-full justify-start gap-2 bg-transparent p-0 border-b border-border">
              {["about", "experience", "contact"].map((tab, i) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="relative rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none bg-transparent"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* About Tab */}
            <TabsContent
              value="about"
              className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  Background
                </h2>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground pl-4 border-l-2 border-border hover:border-muted-foreground/50 transition-colors duration-300">
                  <p className="animate-in fade-in duration-500 delay-100">
                    Self-taught developer back in 2017 by learning{" "}
                    <span className="font-medium text-foreground hover:text-primary transition-colors">
                      Lua
                    </span>
                  </p>
                  <p className="animate-in fade-in duration-500 delay-200">
                    Now learning things properly at university and working with{" "}
                    <span className="font-medium text-foreground">J*va</span>,{" "}
                    <span className="font-medium text-foreground">Python</span>,{" "}
                    <span className="font-medium text-foreground">Rust</span>,
                    and whatever breaks next
                  </p>
                </div>
              </section>

              <section className="group">
                <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                  Languages & Tools
                </h2>
                <div className="flex flex-wrap gap-3">
                  {["J*va", "Rust", "Python", "Linux"].map((tool, i) => (
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
                  Interested In
                </h2>
                <div className="flex flex-wrap gap-3">
                  {["TypeScript", "JavaScript", "Kotlin", "Go"].map(
                    (interest, i) => (
                      <span
                        key={interest}
                        className="rounded-lg bg-muted/50 border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-105 transition-all duration-300 cursor-default animate-in fade-in zoom-in-95"
                        style={{ animationDelay: `${i * 100 + 500}ms` }}
                      >
                        {interest}
                      </span>
                    ),
                  )}
                </div>
              </section>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent
              value="experience"
              className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <section>
                <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Projects
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      name: "Kopuz",
                      href: "https://github.com/Kopuz-org/kopuz",
                      description:
                        "Open-source music player built with Rust and Dioxus.\nCurrently contributing features and fixing bugs.",
                      tags: ["Rust", "Dioxus"],
                    },
                    {
                      name: "1 in 10000 chance of Foxy jumpscare per second",
                      href: "https://github.com/ak4duy/1_10000_jumpscare",
                      description:
                        "An add-on that makes your study thrilling.\nEvery second, there is a 1 in 10000 chance that Foxy will randomly jumpscare you.",
                      tags: ["Python", "PyQt", "Anki Add-on"],
                    },
                    {
                      name: "DeskForge",
                      href: "https://github.com/ak4duy/DeskForge",
                      description:
                        "A simple TUI launcher editor for Linux no one asked for.",
                      tags: ["Rust", "Ratatui"],
                    },
                  ].map((project, i) => (
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
                  Education
                </h2>
                <div className="group rounded-xl border border-border bg-card/50 p-5 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 delay-100">
                  <h3 className="font-semibold text-foreground">University</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Currently studying and learning things properly (maybe xd).
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    Ongoing
                  </span>
                </div>
              </section>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent
              value="contact"
              className="animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                Get in Touch
              </h2>
              <div className="grid gap-3">
                {[
                  {
                    href: "https://github.com/ak4duy",
                    icon: Github,
                    label: "GitHub",
                    value: "@ak4duy",
                    external: true,
                  },
                  {
                    href: "https://discord.com/users/799965541283528714",
                    icon: MessageCircle,
                    label: "Discord",
                    value: "ak4duy",
                    external: true,
                  },
                  {
                    href: "mailto:akaduy@protonmail.me",
                    icon: Mail,
                    label: "Email",
                    value: "akaduy@protonmail.me",
                    external: false,
                  },
                  {
                    href: "https://github.com/ak4duy.gpg",
                    icon: Key,
                    label: "PGP Key",
                    value: "For encrypted communication",
                    external: true,
                  },
                ].map((contact, i) => (
                  <Link
                    key={contact.label}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-all duration-300 hover:bg-card hover:border-muted-foreground/30 hover:shadow-lg hover:shadow-foreground/5 hover:translate-x-1 animate-in fade-in slide-in-from-left-4"
                    style={{ animationDelay: `${i * 75}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-muted group-hover:scale-110 transition-all duration-300">
                      <contact.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
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
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center animate-in fade-in duration-700 delay-500">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
          <p className="text-xs italic text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-300">
            born to use j*va, forced to use rust
          </p>
        </footer>
      </div>
    </main>
  );
}
