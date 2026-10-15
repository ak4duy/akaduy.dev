const WEBSITE_ID = "eac4f9b0-6242-4c87-bd4a-765e35e3db75";
const SITE_ORIGIN = "https://akaduy.dev";

function error(message, status, headers = {}) {
  return Response.json({ error: message }, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    const isScript = pathname === "/s.js";
    if (!isScript && pathname !== "/api/send") {
      return error("Not found", 404);
    }

    const allowedMethods = isScript ? ["GET", "HEAD"] : ["POST"];
    if (!allowedMethods.includes(request.method)) {
      return error("Method not allowed", 405, { allow: allowedMethods.join(", ") });
    }

    try {
      if (isScript) {
        const upstream = await fetch("https://cloud.umami.is/script.js");
        if (!upstream.ok) return error("Tracker unavailable", 502);

        return new Response(request.method === "HEAD" ? null : upstream.body, {
          headers: {
            "content-type": "application/javascript; charset=utf-8",
            "cache-control": "public, max-age=3600",
            "x-content-type-options": "nosniff",
          },
        });
      }

      const origin = request.headers.get("origin");
      if (origin && origin !== SITE_ORIGIN) {
        return error("Origin not allowed", 403);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return error("Invalid JSON", 400);
      }
      if (body?.payload?.website !== WEBSITE_ID) {
        return error("Invalid website", 400);
      }

      const headers = new Headers({ "content-type": "application/json" });
      for (const name of ["user-agent", "x-umami-cache", "x-umami-website-id", "x-umami-hostname"]) {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
      }
      // Use Cloudflare's visitor address, never a client-supplied forwarding header.
      const ip = request.headers.get("cf-connecting-ip");
      if (ip) headers.set("x-forwarded-for", ip);

      const upstream = await fetch("https://gateway.umami.is/api/send", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          "content-type": upstream.headers.get("content-type") ?? "application/json",
          "cache-control": "no-store",
        },
      });
    } catch {
      return error("Upstream unavailable", 502);
    }
  },
};
