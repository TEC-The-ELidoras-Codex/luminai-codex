import Link from "next/link";
import { notFound } from "next/navigation";

import { ScreenView } from "@/components/surfaces/ScreenView";
import { getScreen, listScreens, screenRouteToSlug, screenSlugToRoute } from "@/lib/screens";

interface ScreenSpecPageProps {
  readonly params: { slug: string };
}

export default function ScreenSpecPage({ params }: ScreenSpecPageProps) {
  const route = screenSlugToRoute(params.slug);
  const screen = getScreen(route);

  if (!screen) {
    notFound();
  }

  return <ScreenView screen={screen} supportContent={<SpecSupport route={route} />} />;
}

function SpecSupport({ route }: { readonly route: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm uppercase tracking-[0.32em] text-text-muted">Usage</h2>
      <p>
        These grid coordinates map directly to the surface rendered at
        <code className="mx-1 rounded bg-surface-base/60 px-2 py-0.5 text-xs">{route}</code>. Align
        section IDs with your data fetchers and hydrate the listed components in{" "}
        <strong>components/surfaces</strong> when wiring live data.
      </p>
      <Link
        href={route}
        className="inline-flex items-center gap-2 rounded-full border border-border-subtle/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-text-secondary transition hover:border-accent-primary/60 hover:text-text-primary"
      >
        View live surface
        <span aria-hidden>↗</span>
      </Link>
    </div>
  );
}

export function generateStaticParams() {
  return listScreens().map((screen) => ({
    slug: screenRouteToSlug(screen.route),
  }));
}
