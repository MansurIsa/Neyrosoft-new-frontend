/**
 * The Neyrosoft mark, redrawn as vector: a navy cog opening to the right, with
 * red circuit traces leaving through the gap and terminating on round nodes.
 * Colours follow the theme, so it stays readable in dark mode.
 */

export function LogoMark({
  className = "",
  size = 34,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* cog, open on the right */}
      <path
        d="M32.62 36.52 L32.63 42.04 A 20 20 0 0 1 27.62 43.67 L24.38 39.20 A 15.2 15.2 0 0 1 23.62 39.20 L20.38 43.67 A 20 20 0 0 1 15.37 42.04 L15.38 36.52 A 15.2 15.2 0 0 1 14.76 36.07 L9.51 37.78 A 20 20 0 0 1 6.41 33.52 L9.67 29.06 A 15.2 15.2 0 0 1 9.43 28.33 L4.17 26.63 A 20 20 0 0 1 4.17 21.37 L9.43 19.67 A 15.2 15.2 0 0 1 9.67 18.94 L6.41 14.48 A 20 20 0 0 1 9.51 10.22 L14.76 11.93 A 15.2 15.2 0 0 1 15.38 11.48 L15.37 5.96 A 20 20 0 0 1 20.38 4.33 L23.62 8.80 A 15.2 15.2 0 0 1 24.38 8.80 L27.62 4.33 A 20 20 0 0 1 32.63 5.96 L32.62 11.48"
        stroke="var(--logo-ink)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28.5 12.9 A 12 12 0 1 0 28.5 35.1"
        stroke="var(--logo-ink)"
        strokeWidth="2.1"
        strokeLinecap="round"
      />

      <g
        stroke="var(--signal)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M27 14v20" />
        <path d="M27 19h-7M27 29h-7" />
        <path d="M27 14v-3.4M27 34v3.4" />
        <path d="M27 24h11" />
      </g>
      <g fill="var(--signal)">
        <circle cx="27" cy="8" r="2.6" />
        <circle cx="27" cy="40" r="2.6" />
        <circle cx="40.4" cy="24" r="2.6" />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "",
  size = 34,
  showWordmark = true,
}: {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="font-display flex flex-col leading-[0.88] font-extrabold">
          <span className="text-signal text-[1.02rem] tracking-[0.02em]">NEYRO</span>
          <span className="text-logo-ink text-[1.02rem] tracking-[0.19em]">SOFT</span>
        </span>
      )}
    </span>
  );
}
