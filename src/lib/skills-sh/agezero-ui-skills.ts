/**
 * AgeZero UI's own shipped agent skills. These live in the `.skills/`
 * directory of the repo, ready for Open Design / IDE integration.
 */
export interface JsnSkill {
  slug: string;
  name: string;
  description: string;
  file: string;
  size: number;
  tags: string[];
}

const SKILLS: JsnSkill[] = [
  { slug: "agezero-overview", name: "AgeZero UI Overview", description: "What is AgeZero UI, the 32+2+18 stack, the registry, and how to use it.", file: ".skills/agezero-overview.md", size: 1850, tags: ["overview", "introduction"] },
  { slug: "agezero-cli", name: "AgeZero UI CLI", description: "init / add / list / info / mcp commands. Zero runtime dependencies.", file: ".skills/agezero-cli.md", size: 1320, tags: ["cli", "tooling"] },
  { slug: "agezero-theming", name: "AgeZero UI Theming", description: "OKLCH design tokens, dark mode, and the live theme builder widget.", file: ".skills/agezero-theming.md", size: 1480, tags: ["theming", "design-tokens"] },
  { slug: "agezero-icons", name: "AgeZero UI Icons", description: "60+ hand-rolled 1.5px stroke icons across 8 groups. All currentColor.", file: ".skills/agezero-icons.md", size: 1240, tags: ["icons"] },
  { slug: "agezero-animation", name: "AgeZero UI Animation", description: "Motion elements: FadeIn, ScrollReveal, CountUp, Aurora, Beam, Meteors, …", file: ".skills/agezero-animation.md", size: 1610, tags: ["motion", "animation"] },
  { slug: "agezero-a11y", name: "AgeZero UI A11y", description: "ARIA roles, keyboard nav, prefers-reduced-motion, and the a11y checklist.", file: ".skills/agezero-a11y.md", size: 1100, tags: ["a11y"] },
  { slug: "agezero-ai", name: "AgeZero UI AI", description: "Message, Conversation, Reasoning, Tool, Sources, AgentCard, and more.", file: ".skills/agezero-ai.md", size: 1980, tags: ["ai", "agents"] },
  { slug: "agezero-seo", name: "AgeZero UI SEO", description: "next-seo integration, 17 JSON-LD components, sitemap / robots / manifest.", file: ".skills/agezero-seo.md", size: 1350, tags: ["seo"] },
  { slug: "agezero-mobile", name: "AgeZero UI Mobile", description: "MobileDrawer, BottomSheet, Swipeable, ResponsiveTabs, TouchTarget.", file: ".skills/agezero-mobile.md", size: 980, tags: ["mobile"] },
  { slug: "agezero-template", name: "AgeZero UI Templates", description: "8 page templates + 18 AI app templates. Drop one in, wire to your LLM.", file: ".skills/agezero-template.md", size: 1700, tags: ["templates", "apps"] },
  { slug: "agezero-performance", name: "AgeZero UI Performance", description: "Tree-shaking, dynamic imports, server components, and bundle analysis.", file: ".skills/agezero-performance.md", size: 1250, tags: ["performance"] },
  { slug: "agezero-ai-agent-skill", name: "AgeZero UI Agent Skill", description: "Meta-skill: how an agent should use the AgeZero UI kit end-to-end.", file: ".skills/agezero-ai-agent-skill.md", size: 2200, tags: ["meta", "agent"] },
];

export function getJsnSkills() {
  return SKILLS;
}
export function getJsnSkill(slug: string) {
  return SKILLS.find((s) => s.slug === slug);
}
