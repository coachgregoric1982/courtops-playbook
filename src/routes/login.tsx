import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useT } from "@/lib/use-t";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate();
  const t = useT();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!isPending && user) {
    return <Navigate to="/club" />;
  }

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Coach",
        });
        if (err) throw new Error(err.message || t("login.createFail"));
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message || t("login.inFail"));
      }
      void navigate({ to: "/club" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.fail"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell hideNav>
      <main className="flex flex-col px-5 pb-10">
        <Link to="/" className="text-sm text-muted">
          {t("login.back")}
        </Link>
        <h1 className="mt-6 font-display text-3xl text-fg">{t("login.title")}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">{t("login.blurb")}</p>

        {isPending ? (
          <div className="mt-8 h-11 w-full animate-pulse rounded-md bg-raised" />
        ) : authEnabled ? (
          <div className="mt-8 flex flex-col gap-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                onClick={() => void signIn(p.providerId, { callbackURL: "/club" })}
              >
                {t("login.continue", { label: p.label })}
              </Button>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">{t("login.disabled")}</p>
        )}

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-[0.14em] text-faint">
            {t("login.email")}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="mt-5 flex flex-col gap-3" onSubmit={(e) => void onEmail(e)}>
          {mode === "up" ? (
            <div>
              <Label htmlFor="name">{t("login.yourName")}</Label>
              <Input
                id="name"
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          ) : null}
          <div>
            <Label htmlFor="email">{t("login.email")}</Label>
            <Input
              id="email"
              className="mt-1"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">{t("login.password")}</Label>
            <Input
              id="password"
              className="mt-1"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={busy || !authEnabled}>
            {busy ? t("login.working") : mode === "up" ? t("login.create") : t("login.title")}
          </Button>
        </form>
        <button
          type="button"
          className="mt-4 min-h-11 text-sm text-muted"
          onClick={() => {
            setMode((m) => (m === "in" ? "up" : "in"));
            setError("");
          }}
        >
          {mode === "in" ? t("login.newHere") : t("login.haveAccount")}
        </button>
      </main>
    </AppShell>
  );
}
