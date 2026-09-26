import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { activateClubPlan, getMyClub, type ClubRow } from "@/lib/club";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/subscribe")({ component: SubscribePage });

function SubscribePage() {
  const navigate = useNavigate();
  const t = useT();
  const { user, isPending } = useCurrentUserState();
  const [club, setClub] = useState<ClubRow | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending || !user) return;
    void getMyClub()
      .then((row) => setClub(row))
      .catch(() => setClub(null));
  }, [isPending, user]);

  if (isPending || club === undefined) {
    return (
      <AppShell>
        <PageHeader kicker={t("club.plan")} title={t("sub.title")} />
        <div className="mx-4 h-48 animate-pulse rounded-xl bg-surface" />
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const onActivate = async () => {
    setError("");
    setBusy(true);
    try {
      const row = await activateClubPlan();
      setClub(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("sub.fail"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader kicker={t("sub.kicker")} title={t("sub.title")} />
      <div className="flex flex-col gap-4 px-4 pb-10">
        <p className="text-sm text-muted">{t("sub.blurb")}</p>
        <div className="hw-card p-4">
          <p className="hw-label text-[#a8480a]">
            {t("sub.sideline")}
          </p>
          <p className="hw-headline mt-1 text-[32px]">{t("sub.free")}</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
            <li>{t("sub.sideline1")}</li>
            <li>{t("sub.sideline2")}</li>
            <li>{t("sub.sideline3")}</li>
          </ul>
        </div>
        <div className="rounded-[22px] bg-[#07102c] p-4 text-white">
          <p className="hw-label text-white/75">
            {t("sub.club")}
          </p>
          <p className="hw-headline mt-1 text-[32px] text-white">{t("sub.forProgram")}</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm opacity-90">
            <li>{t("sub.club1")}</li>
            <li>{t("sub.club2")}</li>
            <li>{t("sub.club3")}</li>
          </ul>
        </div>
        {club?.plan === "club" ? (
          <p className="text-sm text-fg">{t("sub.active", { name: club.name })}</p>
        ) : club ? (
          <>
            <p className="text-xs text-muted">{t("sub.previewHint")}</p>
            <Button onClick={() => void onActivate()} disabled={busy}>
              {busy ? t("sub.activating") : t("sub.activate")}
            </Button>
          </>
        ) : (
          <Button onClick={() => void navigate({ to: "/club" })}>
            {t("sub.createFirst")}
          </Button>
        )}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button variant="ghost" asChild>
          <Link to="/settings">{t("sub.back")}</Link>
        </Button>
      </div>
    </AppShell>
  );
}
