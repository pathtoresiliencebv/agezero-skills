import * as React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { CrossDomainNav, CrossDomainFooter } from "@/lib/cross-nav";

export const metadata: Metadata = {
  title: "skills · AgeZero UI",
  description: "skills — part of the AgeZero UI suite.",
  metadataBase: new URL("https://skills.agezero.io"),
};

export default function SubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <CrossDomainNav active="skills" />
      <main className="flex-1">{children}</main>
      <CrossDomainFooter />
    </div>
  );
}
