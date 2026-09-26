import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createClub, getMyClub, joinClub, type ClubRow } from "@/lib/club";
import { useAppStore } from "@/lib/store";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/club")({ component: ClubPage });

function ClubPage() {
  const t = useT();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const updateSettings = useAppStore((s) => s.updateSettings);
  const settings = useAppStore((s) => s.settings);
  const [club, setClub] = useState<ClubRow | null | undefined>(undefined);
  const [name, setName] = useState(settings.teamName || "");
  const [shortName, setShortName] = useState(settings.shortClubName || "");
  const [code, setCode] = useState("");
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
        <PageHeader kicker={t("club.kicker")} title={t("club.yours")} />
        <div className="mx-4 h-40 animate-pulse rounded-xl bg-surface" />
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const applyLocal = (row: ClubRow) => {
    updateSettings({
      teamName: row.name,
      shortClubName: row.shortName || settings.shortClubName,
    });
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const row = await createClub({ data: { name, shortName } });
      if (row) {
        applyLocal(row);
        setClub(row);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("club.createFail"));
    } finally {
      setBusy(false);
    }
  };

  const onJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const row = await joinClub({ data: { code } });
      if (row) {
        applyLocal(row);
        setClub(row);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("club.joinFail"));
    } finally {
      setBusy(false);
    }
  };

  if (club) {
    const planLabel =
      club.plan === "club"
        ? t("club.plan")
        : club.plan === "expired"
          ? t("club.ended")
          : t("club.trial");
    const role = club.role === "owner" ? t("club.owner") : t("club.coach");
    return (
      <AppShell>
        <PageHeader kicker={t("club.kicker")} title={club.name} />
        <div className="flex flex-col gap-4 px-4 pb-10">
          <div className="mc-card p-4">
            <p className="mc-label text-[#a8480a]">
              {planLabel}
            </p>
            <p className="mc-headline mt-2 text-[32px]">
              {club.shortName || club.name}
            </p>
            <p className="mt-1 text-sm text-muted">
              {t(club.memberCount === 1 ? "club.member1" : "club.members", {
                n: club.memberCount,
                role,
              })}
            </p>
            <div className="mt-4 rounded-[14px] bg-[#f7f4ee] px-3 py-3">
              <p className="mc-label">
                {t("club.code")}
              </p>
              <p className="mc-num mt-1 text-[40px] tracking-[0.12em]">
                {club.joinCode}
              </p>
              <p className="mt-1 text-xs text-muted">{t("club.staffHint")}</p>
            </div>
          </div>
          {club.plan !== "club" ? (
            <Button onClick={() => void navigate({ to: "/subscribe" })}>
              {t("club.plan")}
            </Button>
          ) : null}
          <Button variant="secondary" asChild>
            <Link to="/settings">{t("club.inSettings")}</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader kicker={t("club.kicker")} title={t("club.createJoin")} />
      <div className="flex flex-col gap-6 px-4 pb-10">
        <p className="text-sm text-muted">{t("club.blurb")}</p>
        <form className="mc-card flex flex-col gap-3 p-4" onSubmit={(e) => void onCreate(e)}>
          <h2 className="mc-headline text-[28px]">{t("club.create")}</h2>
          <div>
            <Label htmlFor="club-name">{t("club.name")}</Label>
            <Input
              id="club-name"
              className="mt-1"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Phoenix Youth"
            />
          </div>
          <div>
            <Label htmlFor="short">{t("club.short")}</Label>
            <Input
              id="short"
              className="mt-1"
              maxLength={8}
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="PHX"
            />
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? t("club.creating") : t("club.createCta")}
          </Button>
        </form>
        <form className="mc-card flex flex-col gap-3 p-4" onSubmit={(e) => void onJoin(e)}>
          <h2 className="mc-headline text-[28px]">{t("club.join")}</h2>
          <div>
            <Label htmlFor="code">{t("club.code")}</Label>
            <Input
              id="code"
              className="mt-1 uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="K7M2PQ"
              autoCapitalize="characters"
            />
          </div>
          <Button type="submit" variant="secondary" disabled={busy}>
            {t("club.joinCta")}
          </Button>
        </form>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </div>
    </AppShell>
  );
}
