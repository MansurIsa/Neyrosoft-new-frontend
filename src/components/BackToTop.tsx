"use client";

import { IconArrowUp } from "./Icons";

export default function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="text-muted hover:text-signal inline-flex items-center gap-2 text-xs font-medium transition-colors"
    >
      <IconArrowUp width={14} height={14} />
      {label}
    </button>
  );
}
