import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownView } from "./markdown-view";
import { promises as fs } from "node:fs";
import path from "node:path";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Bot, FileText } from "@/components/icons";
import { getJsnSkills, getJsnSkill } from "@/lib/skills-sh/agezero-ui-skills";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getJsnSkills().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const skill = getJsnSkill(slug);
  if (!skill) return { title: "Skill not found · AgeZero UI" };
  return {
    title: `${skill.name} · AgeZero UI Skill`,
    description: skill.description,
  };
}

async function readSkillFile(slug: string): Promise<string | null> {
  const skill = getJsnSkill(slug);
  if (!skill) return null;
  try {
    const repoRoot = process.cwd();
    const p = path.join(repoRoot, skill.file);
    return await fs.readFile(p, "utf8");
  } catch {
    return null;
  }
}

export default async function JsnSkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getJsnSkill(slug);
  if (!skill) notFound();

  const raw = await readSkillFile(slug);
  const allSkills = getJsnSkills();
  const idx = allSkills.findIndex((s) => s.slug === slug);
  const prev = allSkills[(idx - 1 + allSkills.length) % allSkills.length]!;
  const next = allSkills[(idx + 1) % allSkills.length]!;

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/skills">
            <ArrowLeft size={14} className="mr-1" /> All skills
          </Link>
        </Button>
        <div className="flex gap-1">
          {prev.slug !== slug && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/skills/jsn/${prev.slug}`}>
                <ArrowLeft size={12} className="mr-1" /> {prev.name}
              </Link>
            </Button>
          )}
          {next.slug !== slug && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/skills/jsn/${next.slug}`}>
                {next.name} <ArrowLeft size={12} className="ml-1 rotate-180" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <header className="space-y-3">
        <Badge variant="secondary">
          <Bot size={10} className="mr-1" /> AgeZero UI built-in skill
        </Badge>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {skill.name}
        </h1>
        <p className="text-muted-foreground">{skill.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            <FileText size={10} className="mr-1" /> {skill.file}
          </Badge>
          <Badge variant="outline">{skill.size} chars</Badge>
          {skill.tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </header>

      <Card>
        <CardContent className="p-0">
          {raw ? (
            <MarkdownView raw={raw} file={skill.file} />
          ) : (
            <div className="grid place-items-center py-12 text-sm text-muted-foreground">
              File not found on disk.
            </div>
          )}
        </CardContent>
      </Card>

      <InstallHint />
    </article>
  );
}

function InstallHint() {
  return (
    <Card className="border-dashed">
      <CardContent className="space-y-2 p-4 text-xs text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">How to use this skill</span>
        </p>
        <p>
          These files live in the <code className="rounded bg-muted px-1 font-mono">.skills/</code>{" "}
          directory of the AgeZero UI repo. Open Design–compatible agents
          (Claude Code, Cursor, Cline, etc.) auto-detect them. You can
          also reference them directly:
        </p>
        <pre className="rounded-md border border-border bg-background p-2 font-mono text-[10px]">
{`# in your agent's config
- name: agezero-ui
  source: https://github.com/javashn/agezero-ui/tree/main/.skills`}
        </pre>
      </CardContent>
    </Card>
  );
}