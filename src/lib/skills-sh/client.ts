/**
 * Client for the skills.sh API. Wraps every endpoint, attaches the
 * Vercel OIDC token (in production), and surfaces typed responses.
 */
export type SourceType = "github" | "well-known";

export interface V1Skill {
  id: string;
  slug: string;
  name: string;
  source: string;
  installs: number;
  sourceType: SourceType;
  installUrl: string | null;
  url: string;
  isDuplicate?: boolean;
  installsYesterday?: number;
  change?: number;
}

export interface V1SkillDetail {
  id: string;
  source: string;
  slug: string;
  installs: number;
  hash: string | null;
  files: Array<{ path: string; contents: string }> | null;
}

export interface V1AuditEntry {
  provider: string;
  slug: string;
  status: "pass" | "warn" | "fail";
  summary: string;
  auditedAt: string;
  riskLevel?: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  categories?: string[];
}

export interface V1Audit {
  id: string;
  source: string;
  slug: string;
  audits: V1AuditEntry[];
}

export interface V1List {
  data: V1Skill[];
  pagination: { page: number; perPage: number; total: number; hasMore: boolean };
}

export interface V1Search {
  data: V1Skill[];
  query: string;
  searchType: "fuzzy" | "semantic";
  count: number;
  durationMs: number;
}

export interface V1CuratedOwner {
  owner: string;
  totalInstalls: number;
  featuredRepo: string;
  featuredSkill: string;
  skills: V1Skill[];
}

export interface V1Curated {
  data: V1CuratedOwner[];
  totalOwners: number;
  totalSkills: number;
  generatedAt: string;
}

const BASE = "https://skills.sh/api/v1";

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (process.env.VERCEL_OIDC_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.VERCEL_OIDC_TOKEN}`;
    headers["x-vercel-oidc-token"] = process.env.VERCEL_OIDC_TOKEN;
  }
  return fetch(`${BASE}${path}`, { ...init, headers, next: { revalidate: 60 } });
}

export async function listSkills(
  view: "all-time" | "trending" | "hot" = "trending",
  page = 0,
  perPage = 24
): Promise<V1List> {
  const res = await authedFetch(`/skills?view=${view}&page=${page}&per_page=${perPage}`);
  if (!res.ok) throw new SkillsError(res.status, await res.text());
  return res.json();
}

export async function searchSkills(q: string, limit = 30): Promise<V1Search> {
  const res = await authedFetch(`/skills/search?q=${encodeURIComponent(q)}&limit=${limit}`);
  if (!res.ok) throw new SkillsError(res.status, await res.text());
  return res.json();
}

export async function getCurated(): Promise<V1Curated> {
  const res = await authedFetch("/skills/curated");
  if (!res.ok) throw new SkillsError(res.status, await res.text());
  return res.json();
}

export async function getSkill(id: string): Promise<V1SkillDetail> {
  const res = await authedFetch(`/skills/${id}`);
  if (!res.ok) throw new SkillsError(res.status, await res.text());
  return res.json();
}

export async function getAudit(id: string): Promise<V1Audit> {
  const res = await authedFetch(`/skills/audit/${id}`);
  if (res.status === 404) return { id, source: "", slug: "", audits: [] };
  if (!res.ok) throw new SkillsError(res.status, await res.text());
  return res.json();
}

export class SkillsError extends Error {
  constructor(public status: number, public body: string) {
    super(`skills.sh ${status}: ${body.slice(0, 200)}`);
  }
}
