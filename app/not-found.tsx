"use client";

import Link from "next/link";

const imagePrefix = "/favicon-200x200.jpg";
const fallbackImagePrefix = "/placeholder-logo.png";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 bg-linear-to-br from-background via-background to-accent/20 pointer-events-none" />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 text-center page-enter">
        <img
          src={imagePrefix}
          alt="don don don quixote!!!"
          className="h-40 w-40 rounded-2xl border border-border bg-card object-cover shadow-2xl shadow-black/20 sm:h-48 sm:w-48"
          onError={(event) => {
            event.currentTarget.src = fallbackImagePrefix;
          }}
        />

        <p className="mt-8 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground italic">
          “You will never be happy if you continue to search for what happiness
          consists of. You will never live if you are looking for the meaning of
          life.”
          <span className="mt-3 block text-xs not-italic text-muted-foreground/70">
            - Albert Camus
          </span>
        </p>

        <Link
          href="/en"
          className="mt-8 rounded-xl border border-border bg-card/50 px-5 py-3 text-sm font-medium text-muted-foreground transition-all duration-150 ease-linear hover:-translate-y-0.5 hover:bg-card hover:text-foreground hover:shadow-lg hover:shadow-foreground/5 active:translate-y-0 active:scale-95"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
