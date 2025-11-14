import Link from "next/link";

import { screenRouteToSlug } from "@/lib/screens";

interface ScreenSpecLinkProps {
  readonly route: string;
}

export function ScreenSpecLink({ route }: ScreenSpecLinkProps) {
  const slug = screenRouteToSlug(route);
  return (
    <Link
      href={`/specs/${slug}`}
      className="text-xs font-semibold uppercase tracking-[0.32em] text-text-muted transition hover:text-accent-primary"
    >
      View Screen Spec ↗
    </Link>
  );
}
