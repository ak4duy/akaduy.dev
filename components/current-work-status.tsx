// This does not fetch when user reading blog

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type HackatimeTotal = {
  totalSeconds: number;
  text: string;
};

type HackatimeTopItem = {
  name: string;
  totalSeconds: number;
  text: string;
  percent: number | null;
};

type HackatimeStatus = {
  project: string | null;
  repoUrl: string | null;
  entity: string | null;
  text: string | null;
  dailyTotal: HackatimeTotal | null;
  weeklyTotal: HackatimeTotal | null;
  totalTime: HackatimeTotal | null;
  topLanguage: HackatimeTopItem | null;
  topProject: HackatimeTopItem | null;
};

const statusEndpoint =
  process.env.NEXT_PUBLIC_HACKATIME_STATUS_URL ??
  "https://api.akaduy.dev/hackatime/current";
const refreshIntervalMs = 60_000;
const githubOwner = "ak4duy";

function getFallbackRepoUrl(project: string | null) {
  if (!project || !/^[A-Za-z0-9._-]+$/.test(project)) {
    return null;
  }

  return `https://github.com/${githubOwner}/${project}`;
}

type CurrentWorkStatusProps = {
  label: string;
};

function isBlogPostPath(pathname: string) {
  return /^\/(?:en|vn)\/blog\/[^/]+\/?$/.test(pathname);
}

export function CurrentWorkStatus({ label }: CurrentWorkStatusProps) {
  const pathname = usePathname();
  const [status, setStatus] = useState<HackatimeStatus | null>(null);
  const shouldFetchStatus = !isBlogPostPath(pathname);

  useEffect(() => {
    if (!shouldFetchStatus) {
      setStatus(null);
      return;
    }

    let ignored = false;

    async function loadStatus() {
      try {
        const response = await fetch(statusEndpoint, {
          cache: "no-store",
          headers: { accept: "application/json" },
        });

        if (!response.ok) {
          if (!ignored) {
            setStatus(null);
          }
          return;
        }

        const data = (await response.json()) as HackatimeStatus;

        if (!ignored) {
          setStatus(
            data.project ||
              data.dailyTotal ||
              data.weeklyTotal ||
              data.totalTime ||
              data.topLanguage ||
              data.topProject
              ? data
              : null,
          );
        }
      } catch {
        if (!ignored) {
          setStatus(null);
        }
      }
    }

    loadStatus();
    const intervalId = window.setInterval(loadStatus, refreshIntervalMs);

    return () => {
      ignored = true;
      window.clearInterval(intervalId);
    };
  }, [shouldFetchStatus]);

  if (!status) {
    return null;
  }

  const projectUrl = status.repoUrl ?? getFallbackRepoUrl(status.project);
  const hasProject = Boolean(status.project);

  return (
    <span className="relative top-px inline-flex animate-in zoom-in-95 fade-in slide-in-from-bottom-1 duration-300 items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
      <span
        className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"
        aria-hidden="true"
      />
      {hasProject && (
        <>
          <span>{label}</span>
          {projectUrl ? (
            <a
              className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
              href={projectUrl}
              target="_blank"
              rel="noreferrer"
            >
              {status.project}
            </a>
          ) : (
            <span className="font-semibold text-foreground">
              {status.project}
            </span>
          )}
          {status.entity && (
            <span className="max-w-40 truncate font-mono text-[0.7rem] text-muted-foreground/80 sm:max-w-56">
              ({status.entity})
            </span>
          )}
        </>
      )}
      {status.dailyTotal && (
        <span className="font-semibold text-foreground">
          Today {status.dailyTotal.text}
        </span>
      )}
      {status.weeklyTotal && (
        <span className="font-semibold text-foreground">
          Week {status.weeklyTotal.text}
        </span>
      )}
      {status.totalTime && (
        <span className="font-semibold text-foreground">
          Total {status.totalTime.text}
        </span>
      )}
      {status.topLanguage && (
        <span className="font-semibold text-foreground">
          Top lang {status.topLanguage.name}
        </span>
      )}
      {status.topProject && (
        <span className="font-semibold text-foreground">
          Top project {status.topProject.name}
        </span>
      )}
    </span>
  );
}
