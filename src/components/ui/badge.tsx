import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  children,
}: {
  className?: string;
  tone?: "default" | "accent" | "warn" | "ok" | "mute";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "default" && "bg-raised text-muted",
        tone === "accent" && "bg-accent/15 text-accent-2",
        tone === "warn" && "bg-warn/15 text-warn",
        tone === "ok" && "bg-ok/15 text-ok",
        tone === "mute" && "bg-transparent text-faint shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
