function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
      ...init.headers,
    },
  });
}

function isValidPollIdentifier(value) {
  return typeof value === "string" && /^[a-z0-9._-]{1,100}$/i.test(value);
}

function getClientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function createVoterKey(request, pollId, salt) {
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const ip = getClientIp(request);
  const payload = `${salt}:${pollId}:${ip}:${userAgent}`;
  const data = new TextEncoder().encode(payload);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function getPollCounts(db, pollId) {
  const { results } = await db
    .prepare(
      `SELECT option_id AS optionId, COUNT(*) AS votes
       FROM blog_poll_votes
       WHERE poll_id = ?
       GROUP BY option_id`,
    )
    .bind(pollId)
    .all();

  return (results ?? []).map((row) => ({
    optionId: String(row.optionId),
    votes: Number(row.votes ?? 0),
  }));
}

async function handleBlogPoll(request, env, url) {
  try {
    if (!env.BLOG_POLLS_DB) {
      return json(
        { error: "Missing BLOG_POLLS_DB D1 binding" },
        { status: 500 },
      );
    }

    const pollId = decodeURIComponent(
      url.pathname.replace(/^\/blog-polls\//, "").split("/")[0] ?? "",
    );

    if (!isValidPollIdentifier(pollId)) {
      return json({ error: "Invalid poll id" }, { status: 400 });
    }

    if (request.method === "GET") {
      return json({
        pollId,
        counts: await getPollCounts(env.BLOG_POLLS_DB, pollId),
      });
    }

    if (!env.POLL_VOTE_SALT) {
      return json({ error: "Missing POLL_VOTE_SALT secret" }, { status: 500 });
    }

    const voterKey = await createVoterKey(request, pollId, env.POLL_VOTE_SALT);

    if (request.method === "DELETE") {
      const result = await env.BLOG_POLLS_DB.prepare(
        `DELETE FROM blog_poll_votes
         WHERE poll_id = ? AND voter_key = ?`,
      )
        .bind(pollId, voterKey)
        .run();

      return json({
        pollId,
        deleted: (result.meta?.changes ?? 0) > 0,
        counts: await getPollCounts(env.BLOG_POLLS_DB, pollId),
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const optionId = body?.optionId;

    if (!isValidPollIdentifier(optionId)) {
      return json({ error: "Invalid option id" }, { status: 400 });
    }

    const result = await env.BLOG_POLLS_DB.prepare(
      `INSERT OR IGNORE INTO blog_poll_votes (
        poll_id,
        option_id,
        voter_key,
        created_at
      ) VALUES (?, ?, ?, ?)`,
    )
      .bind(pollId, optionId, voterKey, new Date().toISOString())
      .run();

    return json({
      pollId,
      duplicate: result.meta?.changes === 0,
      counts: await getPollCounts(env.BLOG_POLLS_DB, pollId),
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unknown poll error",
      },
      { status: 500 },
    );
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
          "access-control-allow-headers": "content-type",
        },
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "blog-polls" });
    }

    if (url.pathname.startsWith("/blog-polls/")) {
      return handleBlogPoll(request, env, url);
    }

    return json({ error: "Not found" }, { status: 404 });
  },
};
