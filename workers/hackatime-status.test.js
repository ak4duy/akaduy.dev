import assert from "node:assert/strict";
import { test } from "node:test";
import worker from "./hackatime-status.js";

const env = { HACKATIME_API_KEY: "key" };
const request = () => new Request("https://api.akaduy.dev/hackatime/current");

function setup(t) {
  const store = new Map();
  globalThis.caches = {
    default: {
      match: async (key) => store.get(key.url)?.clone(),
      put: async (key, response) => { store.set(key.url, response); },
    },
  };
  let upstreamCalls = 0;
  t.mock.method(globalThis, "fetch", async (url) => {
    upstreamCalls++;
    return String(url).includes("heartbeats")
      ? Response.json({ project: "akaduy.dev", time: Date.now() / 1000 })
      : Response.json({}, { status: 404 });
  });
  const pending = [];
  const ctx = { waitUntil: (promise) => pending.push(promise) };
  return { ctx, pending, upstreamCalls: () => upstreamCalls };
}

test("serves fresh cached data without calling Hackatime", async (t) => {
  const { ctx, upstreamCalls } = setup(t);
  const first = await (await worker.fetch(request(), env, ctx)).json();
  const callsAfterFirst = upstreamCalls();
  assert.ok(callsAfterFirst > 0);
  const second = await (await worker.fetch(request(), env, ctx)).json();
  assert.equal(upstreamCalls(), callsAfterFirst);
  assert.deepEqual(second, first);
});

test("serves stale data immediately and refreshes it in the background", async (t) => {
  const { ctx, pending, upstreamCalls } = setup(t);
  await worker.fetch(request(), env, ctx);
  const callsAfterFirst = upstreamCalls();
  t.mock.timers.enable({ apis: ["Date"], now: Date.now() + 2 * 60 * 1000 });
  const response = await worker.fetch(request(), env, ctx);
  assert.equal(response.status, 200);
  assert.equal(pending.length, 1);
  await pending[0];
  assert.ok(upstreamCalls() > callsAfterFirst);
});

test("refetches before answering when the cache is too old", async (t) => {
  const { ctx, pending, upstreamCalls } = setup(t);
  await worker.fetch(request(), env, ctx);
  const callsAfterFirst = upstreamCalls();
  t.mock.timers.enable({ apis: ["Date"], now: Date.now() + 11 * 60 * 1000 });
  await worker.fetch(request(), env, ctx);
  assert.equal(pending.length, 0);
  assert.ok(upstreamCalls() > callsAfterFirst);
});

test("does not cache errors", async (t) => {
  const { ctx } = setup(t);
  t.mock.method(globalThis, "fetch", async () => Response.json({}, { status: 500 }));
  assert.equal((await worker.fetch(request(), env, ctx)).status, 502);
  assert.equal(await caches.default.match(request()), undefined);
});
