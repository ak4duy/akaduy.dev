import assert from "node:assert/strict";
import { test } from "node:test";
import worker from "./umami-proxy.js";

const website = "eac4f9b0-6242-4c87-bd4a-765e35e3db75";
const payload = { type: "event", payload: { website, url: "https://akaduy.dev/en/" } };
const post = (body = payload, headers = {}) => new Request("https://akaduy.dev/api/send", {
  method: "POST",
  headers: { "content-type": "application/json", ...headers },
  body: JSON.stringify(body),
});

test("serves the tracker on the local path, including cache-busting queries", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url, "https://cloud.umami.is/script.js");
    return new Response("window.umami = {};", { headers: { "set-cookie": "unwanted=value" } });
  });
  const response = await worker.fetch(new Request("https://akaduy.dev/s.js?v=1"));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /javascript/);
  assert.equal(response.headers.get("cache-control"), "public, max-age=3600");
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(await response.text(), "window.umami = {};");
  const head = await worker.fetch(new Request("https://akaduy.dev/s.js", { method: "HEAD" }));
  assert.equal(await head.text(), "");
});

test("preserves events and sessions, forwards the trusted visitor IP, and excludes cookies", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, init) => {
    assert.equal(url, "https://gateway.umami.is/api/send");
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), payload);
    assert.equal(init.headers.get("x-forwarded-for"), "203.0.113.10");
    assert.equal(init.headers.get("user-agent"), "test-browser");
    assert.equal(init.headers.get("x-umami-cache"), "session-cache");
    assert.equal(init.headers.get("x-umami-website-id"), website);
    assert.equal(init.headers.get("x-umami-hostname"), "akaduy.dev");
    assert.equal(init.headers.get("cookie"), null);
    assert.equal(init.headers.get("authorization"), null);
    return Response.json({ cache: "next-cache", sessionId: "session" });
  });
  const response = await worker.fetch(post(payload, {
    origin: "https://akaduy.dev",
    "cf-connecting-ip": "203.0.113.10",
    "x-forwarded-for": "spoofed",
    "user-agent": "test-browser",
    "x-umami-cache": "session-cache",
    "x-umami-website-id": website,
    "x-umami-hostname": "akaduy.dev",
    cookie: "private=value",
    authorization: "Bearer private",
  }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { cache: "next-cache", sessionId: "session" });
});

test("passes upstream collection errors through without caching them", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ error: "invalid" }, { status: 400 }));
  const response = await worker.fetch(post());
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { error: "invalid" });
});

test("rejects unsupported routes, methods, origins, and website IDs before forwarding", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", () => assert.fail("Must not call upstream"));
  const cases = [
    [new Request("https://akaduy.dev/s.js/other"), 404],
    [new Request("https://akaduy.dev/api/send/other"), 404],
    [new Request("https://akaduy.dev/api/send"), 405],
    [new Request("https://akaduy.dev/s.js", { method: "POST" }), 405],
    [post(payload, { origin: "https://example.org" }), 403],
    [post({ payload: { website: "another-website" } }), 400],
    [post(null), 400],
    [new Request("https://akaduy.dev/api/send", { method: "POST", body: "{" }), 400],
  ];
  for (const [request, status] of cases) {
    assert.equal((await worker.fetch(request)).status, status);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("returns an uncached gateway error when Umami cannot be reached", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new Error("network failure"); });
  for (const request of [new Request("https://akaduy.dev/s.js"), post()]) {
    const response = await worker.fetch(request);
    assert.equal(response.status, 502);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("never caches an upstream script error as JavaScript", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  const response = await worker.fetch(new Request("https://akaduy.dev/s.js"));
  assert.equal(response.status, 502);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
