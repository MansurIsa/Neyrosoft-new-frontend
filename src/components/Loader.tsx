/**
 * Skeleton shown while a route segment streams in. It mirrors the real card
 * grid, so nothing jumps when the content lands.
 */
export default function Loader({ label }: { label?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20" aria-busy="true">
      <div className="bg-surface-2 h-7 w-32 animate-pulse rounded-full" />
      <div className="bg-surface-2 mt-5 h-11 w-2/3 max-w-lg animate-pulse rounded-2xl" />
      <div className="bg-surface-2 mt-4 h-5 w-full max-w-xl animate-pulse rounded-full" />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="card p-6" style={{ opacity: 1 - index * 0.11 }}>
            <div className="bg-surface-2 h-12 w-12 animate-pulse rounded-[15px]" />
            <div className="bg-surface-2 mt-5 h-5 w-3/4 animate-pulse rounded-full" />
            <div className="bg-surface-2 mt-3 h-4 w-full animate-pulse rounded-full" />
            <div className="bg-surface-2 mt-2 h-4 w-5/6 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}
