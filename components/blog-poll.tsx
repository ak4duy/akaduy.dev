"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogPoll as BlogPollData } from "@/lib/blog-posts";

type PollCounts = Record<string, number>;

type BlogPollLabels = {
  vote: string;
  cancel: string;
  votes: string;
  voted: string;
  undo: string;
  loading: string;
  privacy: string;
  error: string;
};

type BlogPollProps = {
  poll: BlogPollData;
  labels: BlogPollLabels;
};

const pollsEndpoint =
  process.env.NEXT_PUBLIC_BLOG_POLLS_URL ?? "https://api.yud-on.top/blog-polls";

function getVoteStorageKey(pollId: string) {
  return `blog-poll:${pollId}:vote`;
}

export function BlogPoll({ poll, labels }: BlogPollProps) {
  const [counts, setCounts] = useState<PollCounts>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [savedVote, setSavedVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalVotes = useMemo(
    () =>
      poll.options.reduce(
        (total, option) => total + (counts[option.id] ?? 0),
        0,
      ),
    [counts, poll.options],
  );

  useEffect(() => {
    setSavedVote(window.localStorage.getItem(getVoteStorageKey(poll.id)));
  }, [poll.id]);

  useEffect(() => {
    let ignored = false;

    async function loadPoll() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${pollsEndpoint}/${encodeURIComponent(poll.id)}`,
          {
            cache: "no-store",
            headers: { accept: "application/json" },
          },
        );

        if (!response.ok) {
          throw new Error("Poll request failed");
        }

        const data = (await response.json()) as {
          counts?: Array<{ optionId: string; votes: number }>;
        };

        if (!ignored) {
          setCounts(
            Object.fromEntries(
              (data.counts ?? []).map((count) => [count.optionId, count.votes]),
            ),
          );
        }
      } catch {
        if (!ignored) {
          setError(labels.error);
        }
      } finally {
        if (!ignored) {
          setLoading(false);
        }
      }
    }

    loadPoll();

    return () => {
      ignored = true;
    };
  }, [labels.error, poll.id]);

  async function undoVote() {
    if (!savedVote || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${pollsEndpoint}/${encodeURIComponent(poll.id)}`,
        {
          method: "DELETE",
          headers: { accept: "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Undo vote request failed");
      }

      const data = (await response.json()) as {
        counts?: Array<{ optionId: string; votes: number }>;
      };

      setCounts(
        Object.fromEntries(
          (data.counts ?? []).map((count) => [count.optionId, count.votes]),
        ),
      );
      setSavedVote(null);
      setSelectedOptionId(null);
      window.localStorage.removeItem(getVoteStorageKey(poll.id));
    } catch {
      setError(labels.error);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitVote(optionId: string | null) {
    if (!optionId || savedVote || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${pollsEndpoint}/${encodeURIComponent(poll.id)}`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ optionId }),
        },
      );

      if (!response.ok) {
        throw new Error("Vote request failed");
      }

      const data = (await response.json()) as {
        counts?: Array<{ optionId: string; votes: number }>;
      };

      setCounts(
        Object.fromEntries(
          (data.counts ?? []).map((count) => [count.optionId, count.votes]),
        ),
      );
      setSavedVote(optionId);
      window.localStorage.setItem(getVoteStorageKey(poll.id), optionId);
    } catch {
      setError(labels.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-border/80 bg-card/80 p-5 shadow-xl shadow-black/10 ring-1 ring-foreground/5">
      <h2 className="text-lg font-semibold text-foreground">{poll.question}</h2>

      <div className="mt-4 space-y-3">
        {poll.options.map((option) => {
          const optionVotes = counts[option.id] ?? 0;
          const percentage =
            totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
          const isSelected =
            savedVote === option.id || selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedOptionId(option.id)}
              disabled={Boolean(savedVote) || submitting}
              className={`group w-full overflow-hidden rounded-xl border p-0 text-left transition-colors duration-150 ${
                isSelected
                  ? "border-muted-foreground/50 bg-card text-foreground ring-2 ring-foreground/10"
                  : "border-border bg-background/40 text-muted-foreground hover:border-muted-foreground/30 hover:bg-card hover:text-foreground"
              } disabled:cursor-default`}
            >
              <span className="relative block px-4 py-3">
                <span
                  className="absolute inset-y-0 left-0 bg-muted/70 transition-[width] duration-300"
                  style={{ width: `${percentage}%` }}
                  aria-hidden="true"
                />
                <span className="relative flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium">{option.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground/80">
                    {percentage}% · {optionVotes} {labels.votes}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedOptionId && !savedVote && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedOptionId(null)}
            disabled={submitting}
            className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-card hover:text-foreground disabled:opacity-50"
          >
            {labels.cancel}
          </button>
          <button
            type="button"
            onClick={() => submitVote(selectedOptionId)}
            disabled={submitting}
            className="rounded-xl border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
          >
            {labels.vote}
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground/70">
        <span>
          {loading ? labels.loading : `${totalVotes} ${labels.votes}`}
        </span>
        {savedVote && (
          <span className="flex items-center gap-2">
            <span>{labels.voted}</span>
            <button
              type="button"
              onClick={undoVote}
              disabled={submitting}
              className="text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground disabled:opacity-50"
            >
              {labels.undo}
            </button>
          </span>
        )}
      </div>

      <p className="mt-3 border-t border-border/60 pt-3 text-[11px] leading-relaxed text-muted-foreground/60">
        {labels.privacy}
      </p>

      {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
    </section>
  );
}
