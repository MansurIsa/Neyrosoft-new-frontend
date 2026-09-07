import type { ReactNode } from "react";

/**
 * Section openers. The small red dot and label tell you which block you're in;
 * it replaces the hairline rule the earlier draft used, which read as clutter
 * once every section sat on a card.
 */
export default function SectionHeading({
  title,
  lead,
  action,
  as: Tag = "h2",
  center = false,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
  center?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-5 ${
        center
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        <Tag
          className={
            Tag === "h1"
              ? "text-body text-3xl sm:text-4xl lg:text-5xl"
              : "text-body text-2xl sm:text-[2rem]"
          }
        >
          {title}
        </Tag>
        {lead && (
          <p className={`text-muted mt-3 leading-relaxed ${center ? "" : "max-w-xl"}`}>
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
