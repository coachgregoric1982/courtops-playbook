import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BookOpen, Clock, Home, Plus, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LOCALE_META } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { useLocale, useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

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

function WhistleMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-10" aria-hidden>
      <rect width="32" height="32" rx="16" fill="#07102c" />
      <circle cx="22.2" cy="8.6" r="4.2" fill="none" stroke="var(--color-accent)" strokeWidth="2.1" />
      <rect x="9.2" y="13.2" width="17.2" height="11.4" rx="5.6" fill="#f3f1ec" />
      <rect x="3.8" y="14.8" width="8.4" height="8.2" rx="2.4" fill="#f3f1ec" />
      <circle cx="19.4" cy="18.9" r="3.15" fill="#07102c" />
      <rect x="5.2" y="17.4" width="3.4" height="2.6" rx=".8" fill="#07102c" />
    </svg>
  );
}

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
  const navigate = useNavigate();
  const t = useT();
  const locale = useLocale();
  const teamName = useAppStore((s) => s.settings.teamName);
  const createPlay = useAppStore((s) => s.createPlay);

  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].bcp47;
  }, [locale]);

  const newPlay = () => {
    const id = createPlay(t("home.newPlay"));
    void navigate({ to: "/playbook/$playId", params: { playId: id } });
  };

  const left = TABS.slice(0, 2);
  const right = TABS.slice(2);

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden bg-transparent text-fg">
      {!hideBrand ? (
        <header className="flex items-center gap-2.5 bg-transparent px-3 pt-[max(0.7rem,env(safe-area-inset-top))] pb-2">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#07102c]">
            <WhistleMark />
          </span>
          <span className="min-w-0">
            <span className="mc-label block truncate text-[#07102c]">
              CourtOps{teamName ? ` · ${teamName}` : ""}
            </span>
            <span className="mc-headline mt-0.5 block truncate text-[24px]">{t("nav.playbook")}</span>
          </span>
          <div className="ml-auto">
            <LanguageSwitcher compact />
          </div>
        </header>
      ) : null}
      <div className={cn("min-h-0 flex-1 overflow-y-auto", hideNav ? "pb-0" : "pb-6")}>{children}</div>
      {!hideNav && (
        <div className="relative shrink-0 no-print">
          <button
            type="button"
            aria-label={t("home.newPlay")}
            onClick={newPlay}
            className="absolute left-1/2 top-0 z-20 grid size-14 -translate-x-1/2 -translate-y-[26px] place-items-center rounded-full border-4 border-white text-[var(--color-accent-fg)] shadow-[0_10px_20px_-6px_color-mix(in_srgb,var(--color-accent)_80%,transparent)]"
            style={{ background: "var(--color-accent)" }}
          >
            <Plus className="size-[26px]" strokeWidth={2.6} />
          </button>
          <nav className="rounded-t-[22px] bg-white pt-[9px] pb-[max(0.35rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-14px_rgba(80,45,10,.45)]">
            <ul className="grid h-[62px] grid-cols-5">
              {[...left, null, ...right].map((tab, index) => {
                if (!tab) return <li key={`gap-${index}`} aria-hidden />;
                const active = tab.match(pathname);
                const Icon = tab.icon;
                return (
                  <li key={tab.to} className="min-w-0">
                    <Link
                      to={tab.to}
                      className={cn(
                        "flex h-full min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-[10.5px] font-semibold tracking-[-0.03em] text-[#6b7391]",
                        active && "font-bold text-[#07102c]",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-[30px] w-12 shrink-0 place-items-center rounded-[15px]",
                          active && "bg-[var(--mc-tint)]",
                        )}
                      >
                        <Icon
                          className={cn("size-[21px]", active ? "text-[var(--color-accent)]" : "text-[#6b7391]")}
                          strokeWidth={active ? 2.4 : 1.8}
                        />
                      </span>
                      <span className="w-full truncate text-center">{t(tab.labelKey)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
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
    <header className="px-4 pb-3 pt-2">
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-end gap-3">
          {leading}
          <div className="min-w-0">
            {kicker ? <p className="mc-label text-[#07102c]">{kicker}</p> : null}
            <h1 className="mc-headline mt-1 text-[44px]">{title}</h1>
          </div>
        </div>
        {action}
      </div>
      <div className="mc-line mt-3" />
    </header>
  );
}
