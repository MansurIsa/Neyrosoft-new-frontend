"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * A thin loading bar under the header. Next.js streams pages, so navigation can
 * feel silent on a slow connection — this gives it a visible start and finish.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 550);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-[3px] overflow-hidden"
    >
      <div
        className="bg-signal h-full w-full"
        style={{ animation: "bar-slide 550ms cubic-bezier(0.4, 0, 0.2, 1)" }}
      />
    </div>
  );
}
