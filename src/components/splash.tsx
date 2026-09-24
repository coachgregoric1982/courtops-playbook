import { useEffect, useState } from "react";
import { AppMark } from "@/components/team-mark";
import { cutSplashSfx, playSplashSfx } from "@/lib/audio";
import { useT } from "@/lib/use-t";

const HOLD_MS = 2600;
const EXIT_MS = 450;

const boot = {
  started: 0,
  done: false,
};

export function Splash() {
  const t = useT();
  const [phase, setPhase] = useState<"in" | "out" | "off">(boot.done ? "off" : "in");

  useEffect(() => {
    if (boot.done) {
      setPhase("off");
      return;
    }
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const share = window.location.hash.includes("hp=");
    if (reduce || share) {
      boot.done = true;
      setPhase("off");
      return;
    }
    if (!boot.started) boot.started = Date.now();
    const wait = Math.max(80, HOLD_MS - (Date.now() - boot.started));
    playSplashSfx(boot.started);
    const t = window.setTimeout(() => setPhase("out"), wait);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => {
      boot.done = true;
      setPhase("off");
    }, EXIT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "off") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "off") return null;

  return (
    <button
      type="button"
      className={phase === "out" ? "splash splash-exit" : "splash"}
      onPointerDown={() => {
        playSplashSfx(boot.started || Date.now());
      }}
      onClick={() => {
        cutSplashSfx(true);
        boot.done = true;
        setPhase("out");
      }}
      aria-label={t("splash.skip")}
    >
      <span className="splash-vignette" />
      <span className="splash-glow" />
      <span className="splash-flare" />
      <span className="splash-stage">
        <span className="splash-ring" />
        <AppMark size={92} className="splash-mark" />
        <svg className="splash-court" viewBox="0 0 200 210" aria-hidden>
          <path d="M28 28h144" />
          <rect x="70" y="28" width="60" height="52" />
          <path d="M40 28c0 92 120 92 120 0" />
          <circle cx="100" cy="40" r="9" />
          <circle cx="58" cy="176" r="7" fill="currentColor" stroke="none" />
          <path d="M66 170l36-92" />
          <path d="M90 86l14-10-4 16" />
        </svg>
        <span className="splash-copy">
          <span className="splash-kicker">{t("splash.kicker")}</span>
          <span className="splash-title">
            <span>Court</span>
            <span>Ops</span>
          </span>
          <span className="splash-sub">{t("splash.sub")}</span>
        </span>
      </span>
    </button>
  );
}
