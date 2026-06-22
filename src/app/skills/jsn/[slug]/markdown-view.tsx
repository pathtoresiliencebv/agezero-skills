"use client";

import * as React from "react";
import { Copy, Check, Download } from "@/components/icons";

/**
 * Renders the contents of a SKILL.md file with a copy button. Used
 * inside the dynamic /skills/jsn/[slug] route.
 */
export function MarkdownView({ raw, file }: { raw: string; file: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="relative">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-1.5 text-[10px] text-muted-foreground">
        <span className="font-mono">{file}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:border-primary/40"
          >
            {copied ? (
              <>
                <Check size={10} /> Copied
              </>
            ) : (
              <>
                <Copy size={10} /> Copy
              </>
            )}
          </button>
          <a
            href={`https://github.com/javashn/agezero-ui/blob/main/${file}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] hover:border-primary/40"
          >
            <Download size={10} /> GitHub
          </a>
        </div>
      </div>
      <pre className="max-h-[60vh] overflow-auto bg-zinc-950 p-4 font-mono text-[11.5px] leading-relaxed text-zinc-100">
        <code>{raw}</code>
      </pre>
    </div>
  );
}