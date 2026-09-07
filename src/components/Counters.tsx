"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  label: string;
}

/** Counts up once, the first time the block scrolls into view. */
function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);

  return value;
}

/** "Satisfaction rate 98" reads as a percentage, not a count. */
function suffixFor(stat: Stat): string {
  return /faiz|percent|%|rate/i.test(stat.label) ? "%" : "+";
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCountUp(stat.value, active);
  return (
    <div className="card px-6 py-7 text-center">
      <p className="text-body font-display text-4xl leading-none font-bold tabular-nums sm:text-[2.75rem]">
        {value}
        <span className="text-signal">{suffixFor(stat)}</span>
      </p>
      <p className="text-muted mt-3 text-sm leading-snug">{stat.label}</p>
    </div>
  );
}

export default function Counters({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visible = stats.filter((stat) => stat.value > 0 && stat.label);
  if (visible.length === 0) return null;

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {visible.map((stat) => (
        <StatItem key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  );
}
