"use client";
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`card p-4 ${className}`}>
      <div className="skeleton h-3 w-24 rounded mb-3" />
      <div className="skeleton h-7 w-32 rounded mb-2" />
      <div className="skeleton h-3 w-16 rounded" />
    </div>
  );
}
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border-soft px-4">
      <div className="skeleton h-4 w-16 rounded" />
      <div className="skeleton h-4 w-32 rounded flex-1" />
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton h-4 w-16 rounded" />
      <div className="skeleton h-4 w-16 rounded hidden md:block" />
      <div className="skeleton h-4 w-16 rounded hidden lg:block" />
    </div>
  );
}
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
    </div>
  );
}
export function SkeletonBanner() {
  return (
    <div className="card p-5 mb-6">
      <div className="skeleton h-4 w-48 rounded mb-3" />
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-3/5 rounded" />
      </div>
    </div>
  );
}
