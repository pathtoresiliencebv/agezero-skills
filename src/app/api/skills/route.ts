/**
 * Skills API proxy for the skills subdomain.
 * Returns a list of curated skills (live feed from skills.sh if OIDC available).
 */
import { NextResponse } from "next/server";

const CACHE = { ts: 0, data: null as null | object[] };
const TTL = 60_000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const view = url.searchParams.get("view") ?? "trending";
  const perPage = Number(url.searchParams.get("per_page") ?? "24");

  // Try the live skills.sh API with optional OIDC
  const base = "https://skills.sh/api/v1";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.VERCEL_OIDC_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.VERCEL_OIDC_TOKEN}`;
    headers["x-vercel-oidc-token"] = process.env.VERCEL_OIDC_TOKEN;
  }

  if (Date.now() - CACHE.ts < TTL && CACHE.data) {
    return NextResponse.json({ data: CACHE.data, cached: true });
  }

  try {
    const res = await fetch(
      `${base}/skills?view=${view}&page=0&per_page=${perPage}`,
      { headers, next: { revalidate: 60 } },
    );
    if (res.ok) {
      const json = await res.json();
      CACHE.ts = Date.now();
      CACHE.data = json.data ?? [];
      return NextResponse.json(json);
    }
    // 401 / 403 - need OIDC
    return NextResponse.json(
      { data: [], error: "OIDC required", hint: "Enable Vercel OIDC on this project." },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { data: [], error: String(err) },
      { status: 200 },
    );
  }
}
