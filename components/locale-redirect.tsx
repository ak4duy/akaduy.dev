"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type LocaleRedirectProps = {
  href: string;
};

export function LocaleRedirect({ href }: LocaleRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 text-center">
        <p className="text-sm text-muted-foreground">
          Redirecting to{" "}
          <Link href={href} className="font-medium text-foreground underline underline-offset-4">
            {href}
          </Link>
          ...
        </p>
      </div>
    </main>
  );
}
