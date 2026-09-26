import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { TeamMark } from "@/components/team-mark";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resizeLogoFile } from "@/lib/brand";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { parseRosterCsv, rosterToCsv } from "@/lib/roster";
import { useAppStore } from "@/lib/store";
import { AGE_GROUPS, COLOR_PRESETS, POSITIONS } from "@/lib/types";
import type { RosterPlayer } from "@/lib/types";
import { useT } from "@/lib/use-t";
import { cn, downloadText, uid } from "@/lib/utils";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setRoster = useAppStore((s) => s.setRoster);
  const plays = useAppStore((s) => s.plays);
  const plans = useAppStore((s) => s.plans);
  const t = useT();
  const { isPending } = useCurrentUserState();
  const logoRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);

  const roster = settings.roster;

  const patchPlayer = (id: string, next: Partial<RosterPlayer>) => {
    setRoster(roster.map((p) => (p.id === id ? { ...p, ...next } : p)));
  };

  return (
    <AppShell>
      <PageHeader kicker={t("settings.kicker")} title={t("settings.title")} />
      <div className="flex flex-col gap-4 px-4 pb-10">
        <section className="hw-card p-4">
          <h2 className="hw-headline text-[28px]">{t("settings.account")}</h2>
          {isPending ? (
            <div className="mt-3 h-10 animate-pulse rounded-md bg-raised" />
          ) : (
            <>
              <SignedOut>
                <p className="mt-2 text-sm text-muted">{t("settings.accountHint")}</p>
                <Button className="mt-3" asChild>
                  <Link to="/login">{t("home.signIn")}</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="mt-3">
                  <UserButton />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="secondary" asChild>
                    <Link to="/club">{t("club.kicker")}</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link to="/subscribe">{t("club.plan")}</Link>
                  </Button>
                </div>
              </SignedIn>
            </>
          )}
        </section>
        <section className="hw-card flex flex-col gap-4 p-4">
          <div>
            <Label htmlFor="team">{t("settings.team")}</Label>
          <Input
            id="team"
            className="mt-1"
            value={settings.teamName}
            onChange={(e) => updateSettings({ teamName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="club">{t("settings.shortClub")}</Label>
          <Input
            id="club"
            className="mt-1"
            maxLength={8}
            placeholder="PHX"
            value={settings.shortClubName}
            onChange={(e) => updateSettings({ shortClubName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="age">{t("settings.age")}</Label>
          <NativeSelect
            id="age"
            className="mt-1"
            value={settings.ageGroup}
            onChange={(e) => updateSettings({ ageGroup: e.target.value })}
          >
            {AGE_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <Label htmlFor="len">{t("settings.length")}</Label>
          <Input
            id="len"
            className="mt-1"
            type="number"
            min={30}
            max={180}
            value={settings.defaultPracticeMinutes}
            onChange={(e) =>
              updateSettings({
                defaultPracticeMinutes: Number(e.target.value) || 90,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="color">{t("settings.color")}</Label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => updateSettings({ primaryColor: c })}
                className={cn(
                  "size-11 rounded-full border border-border",
                  settings.primaryColor === c && "ring-2 ring-fg ring-offset-2 ring-offset-bg",
                )}
                style={{ background: c }}
              />
            ))}
            <input
              id="color"
              type="color"
              value={settings.primaryColor}
              aria-label={t("settings.customColor")}
              className="size-11 cursor-pointer rounded-full border border-border bg-raised p-1"
              onChange={(e) => updateSettings({ primaryColor: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label>{t("settings.logo")}</Label>
          <div className="mt-2 flex items-center gap-3">
            <TeamMark logoUrl={settings.logoDataUrl} size={56} />
            <div className="flex flex-col gap-2">
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  try {
                    const data = await resizeLogoFile(file);
                    updateSettings({ logoDataUrl: data });
                    toast(t("settings.logoSaved"));
                  } catch (err) {
                    toast(err instanceof Error ? err.message : t("settings.logoFail"));
                  }
                }}
              />
              <Button variant="secondary" size="sm" onClick={() => logoRef.current?.click()}>
                <Upload className="size-4" />
                {t("settings.uploadLogo")}
              </Button>
              {settings.logoDataUrl ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSettings({ logoDataUrl: "" })}
                >
                  {t("settings.useMark")}
                </Button>
              ) : (
                <p className="text-xs text-muted">{t("settings.noLogo")}</p>
              )}
            </div>
          </div>
          </div>
        </section>

        <section className="mt-4">
          <h2 className="hw-headline text-[28px]">{t("settings.roster")}</h2>
          <p className="mt-1 text-sm text-muted">{t("settings.rosterHint")}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {roster.map((p) => (
              <li
                key={p.id}
                className="hw-card p-2"
              >
                <div className="flex items-center gap-1.5">
                  <RosterJersey number={p.number} name={p.name} />
                  <Input
                    className="w-16 shrink-0"
                    value={p.number}
                    onChange={(e) => patchPlayer(p.id, { number: e.target.value })}
                    aria-label={t("settings.number")}
                    inputMode="numeric"
                  />
                  <Input
                    className="min-w-0 flex-1"
                    value={p.name}
                    onChange={(e) => patchPlayer(p.id, { name: e.target.value })}
                    aria-label={t("settings.name")}
                    placeholder={t("settings.name")}
                  />
                  <button
                    type="button"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-danger"
                    aria-label={t("settings.removePlayer", { name: p.name || t("edit.player") })}
                    onClick={() => setRoster(roster.filter((x) => x.id !== p.id))}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <NativeSelect
                  className="mt-1.5"
                  value={
                    POSITIONS.includes(p.position as (typeof POSITIONS)[number])
                      ? p.position
                      : p.position
                        ? "__custom"
                        : ""
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "__custom") return;
                    patchPlayer(p.id, { position: v });
                  }}
                  aria-label={t("settings.position")}
                >
                  <option value="">{t("settings.position")}</option>
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                  {p.position &&
                  !POSITIONS.includes(p.position as (typeof POSITIONS)[number]) ? (
                    <option value="__custom">{p.position}</option>
                  ) : null}
                </NativeSelect>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                setRoster([
                  ...roster,
                  { id: uid("rp"), number: "", name: "", position: "" },
                ])
              }
            >
              <Plus className="size-4" />
              {t("settings.addPlayer")}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => csvRef.current?.click()}
              >
                {t("settings.importCsv")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  downloadText("roster.csv", rosterToCsv(roster), "text/csv;charset=utf-8");
                  toast(t("settings.csvDown"));
                }}
              >
                {t("settings.exportCsv")}
              </Button>
            </div>
            <input
              ref={csvRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                const text = await file.text();
                const { players, errors } = parseRosterCsv(text);
                setCsvErrors(errors.map((er) => `Row ${er.row}: ${er.message}`));
                if (players.length) {
                  setRoster([...roster, ...players]);
                  toast(
                    t(players.length === 1 ? "settings.importedN" : "settings.importedNs", {
                      n: players.length,
                    }),
                  );
                } else if (!errors.length) {
                  toast(t("settings.csvEmpty"));
                }
              }}
            />
            {csvErrors.length ? (
              <ul className="rounded-lg bg-danger/10 p-3 text-xs text-danger">
                {csvErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <div className="hw-card p-4 text-sm text-muted">
          <p className="font-medium text-fg">{t("settings.thisDevice")}</p>
          <p className="mt-1">
            {t("settings.stored", {
              plays: plays.length,
              plans: plans.length,
              roster: roster.length,
            })}
          </p>
          <p className="mt-2 text-xs text-faint">{t("settings.cloudHint")}</p>
        </div>
      </div>
    </AppShell>
  );
}

function RosterJersey({ number, name }: { number: string; name: string }) {
  const raw = number.trim();
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const chars = (raw ? raw.replace(/\s/g, "").slice(0, 2) : letters) || "?";
  return (
    <svg viewBox="0 0 100 110" className="h-11 w-9 shrink-0" aria-hidden>
      <path
        d="M30 4C31 17 40 25 50 25S69 17 70 4L85 8C85 21 89 29 97 33V104a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V33C11 29 15 21 15 8Z"
        fill="#07102c"
      />
      <path
        d="M30 4C31 17 40 25 50 25S69 17 70 4M15 8C15 21 11 29 3 33M85 8C85 21 89 29 97 33"
        fill="none"
        stroke="#f07828"
        strokeWidth="3.2"
      />
      <text
        x="50"
        y="88"
        textAnchor="middle"
        fontFamily="Big Shoulders Display, Oswald, sans-serif"
        fontWeight="900"
        fontSize={chars.length > 2 ? 28 : 36}
        fill="#ffffff"
        stroke="#f07828"
        strokeWidth="1.2"
        paintOrder="stroke"
      >
        {chars}
      </text>
    </svg>
  );
}
