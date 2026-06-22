import * as React from "react";
import { redirect } from "next/navigation";

export default function SkillSlugRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  redirect(`/skills/jsn/${slug}`);
}
