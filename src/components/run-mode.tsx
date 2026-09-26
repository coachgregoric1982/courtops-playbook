import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Pause, Play, SkipForward, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CourtCanvas } from "@/components/court-canvas";
import { playBeep } from "@/lib/audio";
import { makeLabeler } from "@/lib/roster";
import { useAppStore } from "@/lib/store";
import { formatMmss } from "@/lib/utils";
import { useT } from "@/lib/use-t";
import type { Msg } from "@/lib/i18n";

export function RunMode({ planId }: { planId: string }) {
  const navigate = useNavigate();
  const t = useT();
  const plan = useAppStore((s) => s.plans.find((p) => p.id === planId));
  const plays = useAppStore((s) => s.plays);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [diagram, setDiagram] = useState(false);
  const [playStep, setPlayStep] = useState(0);
  const startedAt = useRef<number | null>(null);
  const startLeft = useRef(0);
  const tickRef = useRef<number | null>(null);

  const block = plan?.blocks[index];
  const next = plan?.blocks[index + 1];
  const linked = block?.playId
    ? plays.find((p) => p.id === block.playId)
    : undefined;
  const roster = useAppStore((s) => s.settings.roster);
  const labelFor = useMemo(
    () => (linked ? makeLabeler(linked, roster) : undefined),
    [linked, roster],
  );

  const clearTick = () => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  useEffect(() => {
    if (!block) return;
    clearTick();
    setRemaining(block.minutes * 60);
    setRunning(false);
    startedAt.current = null;
    setDone(false);
  }, [block?.id]);

  useEffect(() => () => clearTick(), []);

  const start = () => {
    if (done || remaining <= 0) return;
    startedAt.current = Date.now();
    startLeft.current = remaining;
    clearTick();
    tickRef.current = window.setInterval(() => {
      const origin = startedAt.current;
      if (origin == null) return;
      const elapsed = Math.floor((Date.now() - origin) / 1000);
      const left = Math.max(0, startLeft.current - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearTick();
        setRunning(false);
        playBeep();
        const p = useAppStore.getState().plans.find((x) => x.id === planId);
        const i = index;
        if (p && i < p.blocks.length - 1) {
          window.setTimeout(() => setIndex(i + 1), 650);
        } else {
          setDone(true);
        }
      }
    }, 250);
    setRunning(true);
  };
  const pause = () => {
    clearTick();
    if (startedAt.current != null) {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      setRemaining(Math.max(0, startLeft.current - elapsed));
    }
    startedAt.current = null;
    setRunning(false);
  };
  const skip = () => {
    clearTick();
    startedAt.current = null;
    setRunning(false);
    if (!plan) return;
    if (index >= plan.blocks.length - 1) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  };

  const total = block ? block.minutes * 60 : 1;
  const pct = block ? Math.max(0, Math.min(1, 1 - remaining / total)) : 0;
  const linkedStep = linked?.steps[playStep] ?? linked?.steps[0];

  if (!plan || !block) {
    return (
      <div className="px-4 py-16 text-center text-muted">
        {t("run.missing")}
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate({ to: "/practices" })}>
            {t("edit.back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg px-4 pb-6 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("edit.back")}
          onClick={() =>
            navigate({ to: "/practices/$planId", params: { planId: plan.id } })
          }
        >
          <ChevronLeft className="size-5" />
        </Button>
        <p className="hw-label text-[#a8480a]">
          {plan.name}
        </p>
        <span className="size-11" />
      </header>

      <div className="mt-6 flex flex-1 flex-col items-center text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {done ? t("run.complete") : t(`block.${block.type}` as Msg)}
        </p>
        <h1 className="hw-headline mt-2 text-[40px]">
          {done ? t("run.doneTitle") : block.title}
        </h1>
        <div className="relative mt-6 w-full overflow-hidden rounded-[22px] bg-[#07102c] px-4 py-6 text-white">
          <div className="hw-wood pointer-events-none absolute inset-0 opacity-[0.14]" aria-hidden />
          <p
            className="hw-num relative text-[96px] text-[#f07828]"
            data-remaining={remaining}
            aria-live="polite"
          >
            {done ? "0:00" : formatMmss(remaining)}
          </p>
        </div>
        <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#f1ede5]">
          <div
            className="h-full rounded-full bg-[#f07828]"
            style={{ width: `${done ? 100 : pct * 100}%` }}
          />
        </div>
        {block.notes && !done ? (
          <p className="mt-5 max-w-sm text-sm text-muted">{block.notes}</p>
        ) : null}
        {block.cue && !done ? (
          <p className="mt-3 max-w-sm text-sm font-semibold text-[#a8480a]">{block.cue}</p>
        ) : null}
        {block.equipment && !done ? (
          <p className="mt-2 text-xs text-faint">{t("run.need", { item: block.equipment })}</p>
        ) : null}

        <div className="mt-8 flex gap-2">
          {done ? (
            <Button
              onClick={() =>
                navigate({ to: "/practices/$planId", params: { planId: plan.id } })
              }
            >
              {t("run.backPlan")}
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                onClick={running ? pause : start}
                aria-label={running ? t("run.pause") : t("run.start")}
              >
                {running ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5 ml-0.5" />
                )}
                {running ? t("run.pause") : t("run.start")}
              </Button>
              <Button variant="secondary" size="lg" onClick={skip}>
                <SkipForward className="size-5" />
                {t("run.skip")}
              </Button>
            </>
          )}
        </div>

        {linked && !done ? (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setPlayStep(0);
              setDiagram(true);
            }}
          >
            {t("run.diagram")}
          </Button>
        ) : null}
      </div>

      <div className="hw-card p-4">
        <p className="hw-label">{t("run.next")}</p>
        {next && !done ? (
          <p className="hw-headline mt-1 text-[28px]">
            {next.title}{" "}
            <span className="text-[18px] text-[#5f6680]">· {next.minutes} min</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted">
            {done ? t("run.booked") : t("run.last")}
          </p>
        )}
      </div>

      <Dialog open={diagram} onOpenChange={setDiagram}>
        <DialogContent
          title={linked?.name ?? "Play"}
          className="w-[min(100%-1rem,36rem)] p-4"
        >
          {linked && linkedStep ? (
            <div>
              <div className="overflow-hidden rounded-lg bg-court">
                <CourtCanvas court={linked.court} step={linkedStep} labelFor={labelFor} />
              </div>
              {linked.note ? (
                <p className="mt-3 text-sm text-muted">{linked.note}</p>
              ) : null}
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm tabular-nums text-muted">
                  {t("edit.step", { n: playStep + 1 })}/{linked.steps.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setPlayStep((s) =>
                        s >= linked.steps.length - 1 ? 0 : s + 1,
                      )
                    }
                  >
                    Next
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDiagram(false)}>
                    <X className="size-4" />
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
