import { clsx } from "clsx";

interface SkeletonProps {
  readonly className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx("animate-pulse rounded-2xl bg-surface-base/40", className)} />;
}
