const HACKATIME_API_BASE = "https://hackatime.hackclub.com/api/v1";
const GITHUB_OWNER = "ak4duy";

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

function normalizeApiKey(apiKey) {
  return apiKey
    .trim()
    .replace(/^['\"]|['\"]$/g, "")
    .replace(/^Bearer\s+/i, "")
    .replace(/^Basic\s+/i, "");
}

function getAuthHeaders(apiKey, scheme) {
  const normalizedApiKey = normalizeApiKey(apiKey);

  if (scheme === "bearer") {
    return { Authorization: `Bearer ${normalizedApiKey}` };
  }

  if (scheme === "basic-with-colon") {
    return { Authorization: `Basic ${btoa(`${normalizedApiKey}:`)}` };
  }

  return { Authorization: `Basic ${btoa(normalizedApiKey)}` };
}

function getPayloadData(payload) {
  return payload?.data ?? payload;
}

function normalizeProjectName(payload) {
  const data = getPayloadData(payload);

  const candidates = [
    data?.project,
    data?.project_name,
    data?.heartbeat?.project,
    data?.latest_heartbeat?.project,
    data?.current_project,
    data?.current?.project,
    data?.current?.project_name,
    data?.status_bar?.project,
    data?.status_bar?.project_name,
    data?.summary?.project,
    data?.summary?.project_name,
    data?.projects?.[0]?.name,
    data?.projects?.[0]?.project,
    data?.projects?.[0]?.project_name,
  ];

  return candidates
    .find(
      (candidate) =>
        typeof candidate === "string" && candidate.trim().length > 0,
    )
    ?.trim();
}

function normalizeRepoUrl(payload) {
  const data = getPayloadData(payload);

  const candidates = [
    data?.repo,
    data?.repository,
    data?.repo_url,
    data?.repository_url,
    data?.html_url,
    data?.heartbeat?.repo,
    data?.heartbeat?.repository,
    data?.heartbeat?.repo_url,
    data?.heartbeat?.repository_url,
    data?.latest_heartbeat?.repo,
    data?.latest_heartbeat?.repository,
    data?.latest_heartbeat?.repo_url,
    data?.latest_heartbeat?.repository_url,
    data?.current?.repo,
    data?.current?.repository,
    data?.current?.repo_url,
    data?.current?.repository_url,
    data?.projects?.[0]?.repo,
    data?.projects?.[0]?.repository,
    data?.projects?.[0]?.repo_url,
    data?.projects?.[0]?.repository_url,
  ];

  const repoUrl = candidates.find(
    (candidate) =>
      typeof candidate === "string" && /^https?:\/\//i.test(candidate.trim()),
  );

  return repoUrl?.trim();
}

function getGithubRepoApiUrl(project) {
  if (!project || !/^[A-Za-z0-9._-]+$/.test(project)) {
    return null;
  }

  return `https://api.github.com/repos/${GITHUB_OWNER}/${project}`;
}

async function fetchGithubRepoUrl(project) {
  const repoApiUrl = getGithubRepoApiUrl(project);

  if (!repoApiUrl) {
    return null;
  }

  const response = await fetch(repoApiUrl, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "yud-on-top-hackatime-status-worker",
    },
  });

  if (!response.ok) {
    return null;
  }

  const repo = await response.json();

  return typeof repo.html_url === "string" ? repo.html_url : null;
}

async function fetchWithAuthVariants(url, apiKey, attemptLog) {
  const normalizedApiKey = normalizeApiKey(apiKey);
  const attempts = [
    {
      auth: "bearer",
      fetch: () =>
        fetch(url, { headers: getAuthHeaders(normalizedApiKey, "bearer") }),
    },
    {
      auth: "query-api-key",
      fetch: () =>
        fetch(`${url}?api_key=${encodeURIComponent(normalizedApiKey)}`),
    },
    {
      auth: "basic",
      fetch: () =>
        fetch(url, { headers: getAuthHeaders(normalizedApiKey, "basic") }),
    },
    {
      auth: "basic-with-colon",
      fetch: () =>
        fetch(url, {
          headers: getAuthHeaders(normalizedApiKey, "basic-with-colon"),
        }),
    },
  ];

  let response;

  for (const attempt of attempts) {
    response = await attempt.fetch();
    attemptLog.push({ url, auth: attempt.auth, status: response.status });

    if (response.ok) {
      return response;
    }

    if (response.status !== 401 && response.status !== 403) {
      break;
    }
  }

  return response;
}

async function fetchHackatimeStatus(apiKey) {
  const urls = [
    `${HACKATIME_API_BASE}/authenticated/heartbeats/latest`,
    `${HACKATIME_API_BASE}/my/heartbeats/most_recent`,
  ];
  const attemptLog = [];
  let response;

  for (const url of urls) {
    response = await fetchWithAuthVariants(url, apiKey, attemptLog);

    if (response?.ok) {
      return {
        payload: await response.json(),
        attemptLog,
      };
    }
  }

  const error = new Error(
    `Hackatime responded with ${response?.status ?? "unknown"}`,
  );
  error.attemptLog = attemptLog;
  throw error;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, OPTIONS",
          "access-control-allow-headers": "content-type",
        },
      });
    }

    if (request.method !== "GET") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    if (!env.HACKATIME_API_KEY) {
      return json(
        { error: "Missing HACKATIME_API_KEY secret" },
        { status: 500 },
      );
    }

    try {
      const { payload } = await fetchHackatimeStatus(env.HACKATIME_API_KEY);
      const project = normalizeProjectName(payload);
      const repoUrl =
        normalizeRepoUrl(payload) ?? (await fetchGithubRepoUrl(project));

      return json({
        project: project ?? null,
        repoUrl,
        text: project ? `currently working on ${project}` : null,
      });
    } catch (error) {
      return json(
        {
          project: null,
          repoUrl: null,
          text: null,
          error: error instanceof Error ? error.message : "Unknown error",
          attempts: error?.attemptLog,
        },
        { status: 502 },
      );
    }
  },
};
