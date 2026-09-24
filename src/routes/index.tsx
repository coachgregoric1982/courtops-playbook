import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Clock, Plus, Play } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
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

  return (
    <AppShell>
      <PageHeader
        kicker={t("home.kicker")}
        title={settings.teamName || "CourtOps"}
        action={
          <div className="flex items-center gap-2 text-right">
            <div>
              <p className="text-xs text-muted">
                {settings.shortClubName ? `${settings.shortClubName} · ` : ""}
                {settings.ageGroup}
              </p>
            </div>
            <TeamMark logoUrl={settings.logoDataUrl} size={44} />
          </div>
        }
      />

      <div className="mb-4 px-4">
        {isPending ? (
          <div className="h-11 animate-pulse rounded-md bg-raised" />
        ) : (
          <>
            <SignedOut>
              <Link
                to="/login"
                className="flex min-h-11 items-center justify-between rounded-xl bg-surface px-4 text-sm shadow-[var(--shadow-border)]"
              >
                <span className="text-fg">{t("home.clubAccount")}</span>
                <span className="text-accent">{t("home.signIn")}</span>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                to="/club"
                className="flex min-h-11 items-center justify-between rounded-xl bg-surface px-4 text-sm shadow-[var(--shadow-border)]"
              >
                <span className="text-fg">{t("home.yourClub")}</span>
                <span className="text-accent">{t("home.open")}</span>
              </Link>
            </SignedIn>
          </>
        )}
      </div>

      <section className="grid grid-cols-2 gap-3 px-4">
        <button
          type="button"
          className="flex min-h-24 flex-col items-start justify-between rounded-xl bg-accent p-4 text-left text-accent-fg"
          onClick={() => {
            const id = createPlay(t("home.newPlay"));
            void navigate({ to: "/playbook/$playId", params: { playId: id } });
          }}
        >
          <Plus className="size-5" />
          <span className="font-display text-lg leading-tight">{t("home.newPlay")}</span>
        </button>
        <button
          type="button"
          className="flex min-h-24 flex-col items-start justify-between rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)]"
          onClick={() => {
            const id = createPlan();
            void navigate({ to: "/practices/$planId", params: { planId: id } });
          }}
        >
          <Clock className="size-5 text-accent" />
          <span className="font-display text-xl leading-none text-fg">
            {t("home.newPractice")}
          </span>
        </button>
      </section>

      {nextPlan ? (
        <section className="mt-5 px-4">
          <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              {t("home.nextSession")}
            </p>
            <h2 className="mt-1 font-display text-2xl text-fg">{nextPlan.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {formatDateLabel(nextPlan.date, LOCALE_META[locale].bcp47)} ·{" "}
              {planMinutes(nextPlan)} {t("home.min")} ·{" "}
              {t("home.blocks", { n: nextPlan.blocks.length })}
            </p>
            <div className="mt-4 flex gap-2">
              <Button asChild>
                <Link to="/practices/$planId/run" params={{ planId: nextPlan.id }}>
                  <Play className="size-4 ml-0.5" />
                  {t("home.run")}
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/practices/$planId" params={{ planId: nextPlan.id }}>
                  {t("home.openPlan")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {featured ? (
        <section className="mt-6 px-4">
          <div className="mb-2 flex items-end justify-between">
            <h2 className="font-display text-xl text-fg">{t("home.featured")}</h2>
            <Link to="/playbook" className="text-xs font-medium text-accent">
              {t("home.allPlays")}
            </Link>
          </div>
          <Link
            to="/playbook/$playId"
            params={{ playId: featured.id }}
            className="block overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]"
          >
            <PlayThumb play={featured} className="rounded-none" />
            <div className="space-y-2 p-4">
              <h3 className="font-display text-2xl text-fg">{featured.name}</h3>
              <TagRow tags={featured.tags} />
              {featured.note ? (
                <p className="text-sm text-muted">{featured.note}</p>
              ) : null}
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mt-6 px-4 pb-8">
        <h2 className="font-display text-xl text-fg">{t("home.playbook")}</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {plays.slice(0, 5).map((play) => (
            <li key={play.id}>
              <Link
                to="/playbook/$playId"
                params={{ playId: play.id }}
                className="flex items-center gap-3 rounded-xl bg-surface p-2 shadow-[var(--shadow-border)]"
              >
                <div className="w-24 shrink-0">
                  <PlayThumb play={play} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-fg">{play.name}</p>
                  <p className="text-xs text-muted">
                    {play.court === "half" ? t("home.half") : t("home.full")} ·{" "}
                    {t("home.steps", { n: play.steps.length })}
                  </p>
                </div>
                <BookOpen className="ml-auto size-4 shrink-0 text-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
