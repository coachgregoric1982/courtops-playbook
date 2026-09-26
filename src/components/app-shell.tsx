import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Clock, Home, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AppMark } from "@/components/team-mark";
import { LOCALE_META } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const TABS = [
  { to: "/", labelKey: "nav.home" as const, icon: Home, match: (p: string) => p === "/" },
  {
    to: "/playbook",
    labelKey: "nav.playbook" as const,
    icon: BookOpen,
    match: (p: string) => p.startsWith("/playbook"),
  },
  {
    to: "/practices",
    labelKey: "nav.practice" as const,
    icon: Clock,
    match: (p: string) => p.startsWith("/practices"),
  },
  {
    to: "/settings",
    labelKey: "nav.settings" as const,
    icon: Settings,
    match: (p: string) => p.startsWith("/settings"),
  },
] as const;

export function AppShell({
  children,
  hideNav = false,
  hideBrand = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
  hideBrand?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = useT();
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].bcp47;
  }, [locale]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg text-fg">
      {!hideBrand ? (
        <div className="flex items-center gap-2 px-3 pt-[max(0.7rem,env(safe-area-inset-top))] pb-1">
          <AppMark size={30} />
          <span className="font-display text-lg tracking-[0.14em] text-fg">COURTOPS</span>
          <div className="ml-auto">
            <LanguageSwitcher compact />
          </div>
        </div>
      ) : null}
      <div className={cn("flex-1", hideNav ? "pb-0" : "pb-20")}>{children}</div>
      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-lg border-t border-[#ebe6dc] bg-white pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-16px_rgba(7,16,44,0.35)] no-print">
          <ul className="grid grid-cols-4">
            {TABS.map((tab) => {
              const active = tab.match(pathname);
              const Icon = tab.icon;
              return (
                <li key={tab.to}>
                  <Link
                    to={tab.to}
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                      active ? "text-[#07102c]" : "text-[#5f6680]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-[30px] w-[52px] place-items-center rounded-[15px]",
                        active && "bg-[#fde8d9]",
                      )}
                    >
                      <Icon className={cn("size-5", active ? "text-[#f07828]" : "text-[#5f6680]")} strokeWidth={active ? 2.2 : 1.8} />
                    </span>
                    {t(tab.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  action,
  leading,
}: {
  kicker?: string;
  title: string;
  action?: ReactNode;
  leading?: ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-3 px-4 pb-4 pt-3">
      <div className="flex min-w-0 items-end gap-3">
        {leading}
        <div className="min-w-0">
          {kicker ? (
            <p className="hw-label text-[#a8480a]">
              {kicker}
            </p>
          ) : null}
          <h1 className="hw-headline mt-1 text-[40px]">{title}</h1>
        </div>
      </div>
      {action}
    </header>
  );
}