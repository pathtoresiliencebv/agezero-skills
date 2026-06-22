"use client";

import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Aurora } from "@/components/motion/aurora";
import { GridPattern } from "@/components/motion/grid-pattern";
import { Noise } from "@/components/motion/noise";
import { FadeIn } from "@/components/motion/fade-in";
import {
  Search,
  Sparkles,
  Download,
  ExternalLink,
  Shield,
  AlertCircle,
  Check,
  Loader,
  Bot,
  Star,
  Hash,
  TrendingUp,
  Award,
} from "@/components/icons";
import { getJsnSkills, type JsnSkill } from "@/lib/skills-sh/agezero-ui-skills";
import type { V1Skill } from "@/lib/skills-sh/client";
import { cn } from "@/lib/utils";

type FeedState =
  | { kind: "loading" }
  | { kind: "needs-oidc" }
  | { kind: "ready"; data: V1Skill[] }
  | { kind: "error"; message: string };

function formatInstalls(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function useSkillsFeed(view: string, q: string) {
  const [state, setState] = React.useState<FeedState>({ kind: "loading" });
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setState({ kind: "loading" });
      const mode = q.length >= 2 ? "search" : view;
      const qs = new URLSearchParams({ mode });
      if (q.length >= 2) qs.set("q", q);
      if (mode !== "search" && mode !== "curated") qs.set("view", view);
      try {
        const res = await fetch(`/api/skills?${qs.toString()}`);
        if (cancelled) return;
        if (res.status === 401) {
          setState({ kind: "needs-oidc" });
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setState({ kind: "error", message: body.message ?? res.statusText });
          return;
        }
        const body = await res.json();
        setState({ kind: "ready", data: body.data ?? [] });
      } catch (e) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: e instanceof Error ? e.message : "Network error",
        });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [view, q]);
  return state;
}

export default function SkillsPage() {
  const [view, setView] = React.useState("trending");
  const [q, setQ] = React.useState("");
  const feed = useSkillsFeed(view, q);
  const jsnSkills = getJsnSkills();

  return (
    <article className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      {/* Hero */}
      <FadeIn duration={500}>
        <div className="relative isolate overflow-hidden rounded-2xl border border-border/60">
          <Aurora
            colors={["#7c3aed", "#06b6d4", "#10b981"]}
            speed={18}
            intensity={0.4}
            className="absolute inset-0 -z-10"
          />
          <GridPattern className="-z-10 opacity-30" mask="center" />
          <Noise opacity={0.04} />
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <Badge variant="secondary" className="mb-3 bg-background/60 backdrop-blur">
              <Sparkles size={10} className="mr-1" /> skills.sh + AgeZero UI
            </Badge>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Agent skills, all in one place
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Browse the live leaderboard from skills.sh, search across 8,000+ community skills, and explore the
              12 AgeZero UI skills that ship with the kit. Every skill is a Markdown file your agent
              can read.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* AgeZero UI own skills — these are always available */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Bot size={20} className="text-primary" />
              AgeZero UI built-in skills
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              12 skills that ship with the kit. Reference them from any Open Design–compatible agent.
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {jsnSkills.length} skills
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {jsnSkills.map((s) => (
            <JsnsSkillCard key={s.slug} skill={s} />
          ))}
        </div>
      </section>

      {/* skills.sh leaderboard */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <TrendingUp size={20} className="text-primary" />
              Live from skills.sh
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time data from the public leaderboard. Authenticated via Vercel OIDC.
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 8k+ skills…"
              className="h-9 pl-9"
            />
          </div>
        </div>

        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="trending">
              <TrendingUp size={12} className="mr-1" /> Trending
            </TabsTrigger>
            <TabsTrigger value="hot">
              <Sparkles size={12} className="mr-1" /> Hot (last hour)
            </TabsTrigger>
            <TabsTrigger value="all-time">
              <Award size={12} className="mr-1" /> All-time
            </TabsTrigger>
          </TabsList>
          {["trending", "hot", "all-time"].map((v) => (
            <TabsContent key={v} value={v} className="mt-3">
              <FeedView state={feed} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* OIDC help card */}
      <section className="rounded-xl border border-dashed border-border bg-muted/20 p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Shield size={14} /> Enable Vercel OIDC
        </h3>
        <p className="mt-2 text-xs text-muted-foreground">
          The live feed uses the skills.sh API, which requires a Vercel OIDC token. To enable it:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
          <li>Open your Vercel project → Settings → OIDC Federation</li>
          <li>Toggle on. The token will be available as <code className="rounded bg-background px-1 font-mono">process.env.VERCEL_OIDC_TOKEN</code></li>
          <li>Redeploy. The AgeZero UI built-in skills above are always available — the live feed needs OIDC.</li>
        </ol>
      </section>
    </article>
  );
}

function JsnsSkillCard({ skill }: { skill: JsnSkill }) {
  return (
    <Link href={`/skills/jsn/${skill.slug}/`} className="group block">
    <Card className="h-full overflow-hidden transition-colors group-hover:border-primary/40">
      <CardContent className="space-y-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <Bot size={12} />
            </div>
            <h3 className="text-sm font-semibold">{skill.name}</h3>
          </div>
          <Badge variant="outline" className="shrink-0 text-[9px]">
            {skill.size} chars
          </Badge>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
          {skill.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {skill.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[9px]">
              {t}
            </Badge>
          ))}
        </div>
        <p className="flex items-center gap-1 pt-1 font-mono text-[10px] text-muted-foreground">
          <Hash size={9} /> {skill.file}
        </p>
      </CardContent>
    </Card>
    </Link>
  );
}

function FeedView({ state }: { state: FeedState }) {
  if (state.kind === "loading") {
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="space-y-2 p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-md" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <div className="flex gap-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (state.kind === "needs-oidc") {
    return (
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <h3 className="text-sm font-semibold">Vercel OIDC not enabled</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The live leaderboard requires a Vercel OIDC token. Enable it in your project settings and redeploy.
              Meanwhile, you can still browse AgeZero UI&apos;s own skills above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (state.kind === "error") {
    return (
      <Card className="border-rose-500/30 bg-rose-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-500" />
          <div>
            <h3 className="text-sm font-semibold">Could not load feed</h3>
            <p className="mt-1 text-xs text-muted-foreground">{state.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (state.data.length === 0) {
    return (
      <Card>
        <CardContent className="grid place-items-center py-12 text-center text-sm text-muted-foreground">
          <div>
            <Search size={24} className="mx-auto mb-2 opacity-40" />
            No skills found.
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {state.data.map((s) => (
        <FeedSkillCard key={s.id} skill={s} />
      ))}
    </div>
  );
}

function FeedSkillCard({ skill }: { skill: V1Skill }) {
  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noreferrer"
      className="group block"
    >
      <Card className="h-full overflow-hidden transition-colors hover:border-primary/40">
        <CardContent className="space-y-1.5 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid size-7 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary/20 to-cyan-500/20 text-primary">
                <Sparkles size={12} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{skill.name}</h3>
                <p className="truncate text-[10px] text-muted-foreground">{skill.source}</p>
              </div>
            </div>
            <ExternalLink
              size={12}
              className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            <span className="font-mono">{skill.id}</span>
          </p>
          <div className="flex flex-wrap items-center gap-1">
            <Badge variant="secondary" className="text-[9px]">
              <Download size={9} className="mr-0.5" />
              {formatInstalls(skill.installs)}
            </Badge>
            {typeof skill.change === "number" && (
              <Badge
                variant="secondary"
                className={cn(
                  "text-[9px]",
                  skill.change > 0
                    ? "bg-emerald-500/10 text-emerald-600"
                    : skill.change < 0
                      ? "bg-rose-500/10 text-rose-600"
                      : ""
                )}
              >
                {skill.change > 0 ? "+" : ""}
                {skill.change}
              </Badge>
            )}
            {skill.isDuplicate && (
              <Badge variant="outline" className="text-[9px]">
                fork
              </Badge>
            )}
          </div>
          <code className="block truncate text-[9px] text-muted-foreground/70">
            npx skills add {skill.installUrl ?? skill.id}
          </code>
        </CardContent>
      </Card>
    </a>
  );
}