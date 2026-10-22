let pending: { startedAt: number; promise: Promise<unknown> } | null = null;

// Widgets on the same page share one request per refresh.
export function fetchHackatimeStatus<T>() {
  if (!pending || performance.now() - pending.startedAt > 30_000) {
    pending = {
      startedAt: performance.now(),
      promise: fetch("https://api.akaduy.dev/hackatime/current", {
        cache: "no-store",
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      }).then((response) => {
        if (!response.ok) throw new Error("Hackatime status unavailable");
        return response.json();
      }),
    };
  }
  return pending.promise as Promise<T>;
}
