import { cn } from "@/lib/utils";

export function TeamMark({
  logoUrl,
  size = 40,
  className,
  alt = "Team logo",
}: {
  logoUrl?: string;
  size?: number;
  className?: string;
  alt?: string;
}) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={alt}
        width={size}
        height={size}
        className={cn("shrink-0 rounded-sm object-contain", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return <DefaultMark size={size} className={className} />;
}

export function AppMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="100" height="100" rx="22" fill="#070b12" />
      <rect x="12" y="12" width="76" height="76" rx="10" fill="#121a26" />
      <path
        d="M22 20h56"
        fill="none"
        stroke="#d4a017"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect
        x="36"
        y="20"
        width="28"
        height="26"
        fill="none"
        stroke="#d4a017"
        strokeWidth="5"
      />
      <path
        d="M22 20c0 34 56 34 56 0"
        fill="none"
        stroke="#d4a017"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="26" r="5" fill="none" stroke="#f4f1ea" strokeWidth="3.5" />
      <circle cx="32" cy="74" r="6" fill="#d4a017" />
      <path
        d="M38 70l18-22"
        fill="none"
        stroke="#f4f1ea"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M48 52l8-4-2 9"
        fill="none"
        stroke="#f4f1ea"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DefaultMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0 text-accent", className)}
      aria-hidden
    >
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <g
        fill="none"
        stroke="var(--color-accent-fg)"
        strokeWidth="3.4"
        strokeLinecap="round"
      >
        <path d="M12 14h40" />
        <rect x="22" y="14" width="20" height="18" />
        <path d="M12 14c0 24 40 24 40 0" />
        <circle cx="32" cy="18.5" r="3.4" />
      </g>
      {size >= 28 ? (
        <text
          x="32"
          y="50"
          textAnchor="middle"
          fontSize="13"
          fontFamily="Barlow Condensed, Arial Narrow, sans-serif"
          fontWeight="700"
          fill="var(--color-accent-fg)"
        >
          CO
        </text>
      ) : null}
    </svg>
  );
}
