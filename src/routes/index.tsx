import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Play, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PlayThumb, TagRow } from "@/components/play-editor";
import { TeamMark } from "@/components/team-mark";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LOCALE_META } from "@/lib/i18n";
import { useLocale, useT } from "@/lib/use-t";
import { formatDateLabel } from "@/lib/utils";
import { planMinutes, useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function WhistleBadge() {
  return (
    <svg viewBox="0 0 32 32" className="size-11" aria-hidden>
      <circle cx="22.2" cy="8.6" r="4.2" fill="none" stroke="var(--color-accent)" strokeWidth="2.1" />
      <rect x="9.2" y="13.2" width="17.2" height="11.4" rx="5.6" fill="#f3f1ec" />
      <rect x="3.8" y="14.8" width="8.4" height="8.2" rx="2.4" fill="#f3f1ec" />
      <circle cx="19.4" cy="18.9" r="3.15" fill="#07102c" />
      <rect x="5.2" y="17.4" width="3.4" height="2.6" rx=".8" fill="#07102c" />
    </svg>
  );
}

function Home() {
  const navigate = useNavigate();
  const settings = useAppStore((s) => s.settings);
  const plays = useAppStore((s) => s.plays);
  const plans = useAppStore((s) => s.plans);
  const createPlay = useAppStore((s) => s.createPlay);
  const createPlan = useAppStore((s) => s.createPlan);
  const { isPending } = useCurrentUserState();
  const t = useT();
  const locale = useLocale();

  const featured = plays[0];
  const nextPlan = [...plans].sort((a, b) => a.date.localeCompare(b.date))[0];
  const courtSection = featured ? "featured" : "plays";

  const newPlay = () => {
    const id = createPlay(t("home.newPlay"));
    void navigate({ to: "/playbook/$playId", params: { playId: id } });
  };
  const newPractice = () => {
    const id = createPlan();
    void navigate({ to: "/practices/$planId", params: { planId: id } });
  };

  const actions = (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={newPlay}
        className="flex min-h-[78px] flex-col items-start justify-between rounded-[18px] p-3 text-left text-[var(--color-accent-fg)]"
        style={{ background: "var(--color-accent)" }}
      >
        <Plus className="size-5" />
        <span className="text-sm font-bold leading-tight">{t("home.newPlay")}</span>
      </button>
      <button
        type="button"
        onClick={newPractice}
        className="mc-card flex min-h-[78px] flex-col items-start justify-between p-3 text-left"
      >
        <Clock className="size-5 text-[var(--color-accent)]" />
        <span className="text-sm font-bold leading-tight text-[#07102c]">{t("home.newPractice")}</span>
      </button>
    </div>
  );

  return (
    <AppShell>
      <div className="px-4 pt-1">
        <div className="flex items-center gap-3">
          <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_4px_10px_-4px_rgba(80,45,10,.45)]">
            <TeamMark logoUrl={settings.logoDataUrl} size={56} className="size-14 rounded-full object-cover" />
          </span>
          <div className="min-w-0">
            <h1 className="mc-headline truncate text-[28px]">{settings.teamName || "CourtOps"}</h1>
            {settings.ageGroup || settings.shortClubName ? (
              <p className="mt-1 text-sm font-semibold text-[#07102c]">
                {[settings.shortClubName, settings.ageGroup].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-3">
          {isPending ? (
            <div className="h-9 w-40 animate-pulse rounded-full bg-white" />
          ) : (
            <>
              <SignedOut>
                <Link to="/login" className="mc-chip">
                  {t("home.clubAccount")}
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/club" className="mc-chip">
                  {t("home.yourClub")}
                </Link>
              </SignedIn>
            </>
          )}
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mc-line" />
        <div className="relative -mt-[5px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[9px] top-0 border-x-[5px] border-b-[5px] border-t-0 border-white/95"
            style={{ borderRadius: "0 0 50% 50% / 0 0 150px 150px", bottom: 0 }}
          />
          <div className="relative z-10 mx-[26px]">
            <div className="mc-key">
              {nextPlan ? (
                <div className="mc-card px-4 py-[15px]">
                  <p className="mc-label" style={{ color: "var(--mc-ink)" }}>
                    {formatDateLabel(nextPlan.date, LOCALE_META[locale].bcp47)}
                  </p>
                  <h2 className="mc-headline mt-1 text-[26px]">{nextPlan.name}</h2>
                  <p className="mc-num mt-2 text-[22px]">
                    {planMinutes(nextPlan)} {t("home.min")}
                    <span className="mx-1.5 text-[#d0c6b5]">·</span>
                    {t("home.blocks", { n: nextPlan.blocks.length })}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to="/practices/$planId/run" params={{ planId: nextPlan.id }}>
                        <Play className="size-4" />
                        {t("home.run")}
                      </Link>
                    </Button>
                    <Button variant="secondary" asChild className="flex-1">
                      <Link to="/practices/$planId" params={{ planId: nextPlan.id }}>
                        {t("home.openPlan")}
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                actions
              )}
            </div>
          </div>
          <div className="relative h-16">
            <div className="mc-ft absolute left-1/2 top-0 -translate-x-1/2" />
          </div>
        </div>
      </div>

      {nextPlan ? <div className="relative z-10 mt-3 px-4">{actions}</div> : null}

      {featured ? (
        <section className="mt-6">
          <div className="mb-2 flex items-end justify-between gap-2 px-4">
            <h2 className="mc-headline text-[22px]">{t("home.featured")}</h2>
            <Link to="/playbook" className="text-xs font-bold text-[#07102c]">
              {t("home.allPlays")}
            </Link>
          </div>
          <HalfCourt />
          <Link
            to="/playbook/$playId"
            params={{ playId: featured.id }}
            className="mc-card relative z-20 -mt-[44px] mx-4 block overflow-hidden"
          >
            <PlayThumb play={featured} className="rounded-none" />
            <div className="space-y-2 p-4">
              <h3 className="mc-headline text-[28px]">{featured.name}</h3>
              <TagRow tags={featured.tags} />
              {featured.note ? <p className="text-sm font-semibold text-[#5f6680]">{featured.note}</p> : null}
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mt-6 pb-8">
        <h2 className="mc-headline px-4 text-[22px]">{t("home.playbook")}</h2>
        {courtSection === "plays" ? (
          <div className="mt-2">
            <HalfCourt />
          </div>
        ) : null}
        <ul className={courtSection === "plays" ? "relative z-20 -mt-[44px] flex flex-col gap-2 px-4" : "mt-3 flex flex-col gap-2 px-4"}>
          {plays.slice(0, 5).map((play) => (
            <li key={play.id}>
              <Link
                to="/playbook/$playId"
                params={{ playId: play.id }}
                className="mc-card flex items-center gap-3 p-2"
              >
                <div className="w-24 shrink-0">
                  <PlayThumb play={play} />
                </div>
                <div className="min-w-0">
                  <p className="mc-headline truncate text-[22px]">{play.name}</p>
                  <p className="text-xs font-semibold text-[#5f6680]">
                    {play.court === "half" ? t("home.half") : t("home.full")} · {t("home.steps", { n: play.steps.length })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function HalfCourt() {
  return (
    <div className="relative h-[88px]">
      <div className="mc-line absolute inset-x-0 top-1/2 -translate-y-1/2" />
      <div className="mc-circle absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <WhistleBadge />
      </div>
    </div>
  );
}
