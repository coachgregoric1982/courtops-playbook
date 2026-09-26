import { useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  Copy,
  Download,
  Link2,
  Pause,
  Play as PlayIcon,
  Plus,
  Printer,
  Redo,
  SkipForward,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CourtCanvas, type Tool } from "@/components/court-canvas";
import { downloadPlaySheetPng, printPlaySheet } from "@/lib/print";
import { applyStepMoves } from "@/lib/court";
import { defaultRosterSlots, makeLabeler, SLOT_LIST } from "@/lib/roster";
import { packPlay, playToJson } from "@/lib/share";
import { useAppStore } from "@/lib/store";
import type { Play, PlayerSide, PlayStep, PlayTag } from "@/lib/types";
import { PLAY_TAGS } from "@/lib/types";
import { useT } from "@/lib/use-t";
import { cn, downloadText, prefersReducedMotion, slugFile, uid } from "@/lib/utils";
import type { Msg } from "@/lib/i18n";

const TOOL_IDS: Tool[] = [
  "select",
  "pass",
  "dribble",
  "cut",
  "handoff",
  "screen",
  "shot",
  "ball",
];

const TOOL_KEYS: Record<Tool, Msg> = {
  select: "edit.tool.move",
  pass: "edit.tool.pass",
  dribble: "edit.tool.dribble",
  cut: "edit.tool.cut",
  handoff: "edit.tool.handoff",
  screen: "edit.tool.screen",
  shot: "edit.tool.shot",
  ball: "edit.tool.ball",
};

export function PlayEditor({ playId }: { playId: string }) {
  const navigate = useNavigate();
  const savePlay = useAppStore((s) => s.savePlay);
  const deletePlay = useAppStore((s) => s.deletePlay);
  const duplicatePlay = useAppStore((s) => s.duplicatePlay);
  const settings = useAppStore((s) => s.settings);
  const roster = settings.roster;
  const t = useT();

  const [draft, setDraft] = useState<Play | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [tool, setTool] = useState<Tool>("select");
  const [placeSide, setPlaceSide] = useState<PlayerSide>("offense");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [blend, setBlend] = useState(1);
  const [prevStep, setPrevStep] = useState<PlayStep | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareTooLong, setShareTooLong] = useState(false);
  const playRef = useRef(false);
  playRef.current = playing;

  useEffect(() => {
    const p = useAppStore.getState().plays.find((x) => x.id === playId);
    setDraft(p ? structuredClone(p) : null);
    setStepIndex(0);
    setPlaying(false);
    setBlend(1);
    setPrevStep(null);
  }, [playId]);

  useEffect(() => {
    if (!draft) return;
    const t = window.setTimeout(() => savePlay(draft), 280);
    return () => window.clearTimeout(t);
  }, [draft, savePlay]);

  const step = draft?.steps[stepIndex] ?? draft?.steps[0];
  const labelFor = useMemo(
    () => (draft ? makeLabeler(draft, roster) : undefined),
    [draft, roster],
  );

  const empty = useMemo(
    () => (step ? step.players.length === 0 : true),
    [step],
  );

  if (!draft || !step) {
    return (
      <div className="px-4 py-16 text-center text-muted">
        Play not found.
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate({ to: "/playbook" })}>
            Back to playbook
          </Button>
        </div>
      </div>
    );
  }

  const patch = (fn: (p: Play) => Play) => setDraft((d) => (d ? fn(d) : d));

  const updateStep = (next: PlayStep) => {
    patch((p) => ({
      ...p,
      steps: p.steps.map((s, i) => (i === stepIndex ? next : s)),
    }));
  };

  const addStep = () => {
    const moved = applyStepMoves(step);
    const copy: PlayStep = {
      id: uid("st"),
      players: moved.players,
      drawings: [],
      note: "",
      ballId: moved.ballId,
    };
    patch((p) => {
      const steps = [...p.steps];
      steps.splice(stepIndex + 1, 0, copy);
      return { ...p, steps };
    });
    setStepIndex((i) => i + 1);
    setPlaying(false);
    setBlend(1);
    setPrevStep(null);
    setSelectedId(null);
  };

  const duplicateStep = () => {
    const copy: PlayStep = {
      ...step,
      id: uid("st"),
      players: step.players.map((pl) => ({ ...pl })),
      drawings: step.drawings.map((d) => ({
        ...d,
        id: uid("dr"),
        points: d.points.map((pt) => ({ ...pt })),
      })),
    };
    patch((p) => {
      const steps = [...p.steps];
      steps.splice(stepIndex + 1, 0, copy);
      return { ...p, steps };
    });
    setStepIndex((i) => i + 1);
    setSelectedId(null);
  };

  const deleteStep = () => {
    if (draft.steps.length <= 1) {
      toast(t("edit.keepStep"));
      return;
    }
    patch((p) => ({
      ...p,
      steps: p.steps.filter((_, i) => i !== stepIndex),
    }));
    setStepIndex((i) => Math.max(0, i - 1));
    setBlend(1);
    setPrevStep(null);
    setSelectedId(null);
  };

  const undoStroke = () => {
    if (!step.drawings.length) return;
    updateStep({ ...step, drawings: step.drawings.slice(0, -1) });
  };

  const removeSelected = () => {
    if (!selectedId) return;
    if (step.players.some((p) => p.id === selectedId)) {
      updateStep({
        ...step,
        players: step.players.filter((p) => p.id !== selectedId),
        ballId: step.ballId === selectedId ? undefined : step.ballId,
      });
    } else {
      updateStep({
        ...step,
        drawings: step.drawings.filter((d) => d.id !== selectedId),
      });
    }
    setSelectedId(null);
  };

  const animateTo = (nextIndex: number, fromStep: PlayStep = step) => {
    if (nextIndex < 0) return Promise.resolve();
    if (prefersReducedMotion()) {
      setStepIndex(nextIndex);
      setBlend(1);
      setPrevStep(null);
      setSelectedId(null);
      return Promise.resolve();
    }
    setPrevStep(fromStep);
    setStepIndex(nextIndex);
    setBlend(0);
    setSelectedId(null);
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const dur = 1100;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        setBlend(t);
        if (t < 1) requestAnimationFrame(tick);
        else {
          setPrevStep(null);
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  };

  const goToResultOf = (from: PlayStep, fromIndex: number) => {
    const moved = applyStepMoves(from);
    const nextI = fromIndex + 1;
    const exists = nextI < draft.steps.length;
    if (!exists) {
      if (from.drawings.length === 0) {
        setStepIndex(0);
        setBlend(1);
        setPrevStep(null);
        setSelectedId(null);
        return;
      }
      const copy: PlayStep = {
        id: uid("st"),
        players: moved.players,
        drawings: [],
        note: "",
        ballId: moved.ballId,
      };
      patch((p) => ({ ...p, steps: [...p.steps, copy] }));
    } else {
      patch((p) => ({
        ...p,
        steps: p.steps.map((s, i) =>
          i === nextI ? { ...s, players: moved.players, ballId: moved.ballId } : s,
        ),
      }));
    }
    void animateTo(nextI, from);
  };

  const onPlay = async () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    playRef.current = true;
    let i = stepIndex;
    if (i >= draft.steps.length - 1) {
      if (step.drawings.length > 0 && draft.steps.length === 1) {
        goToResultOf(step, 0);
        setPlaying(false);
        return;
      }
      setStepIndex(0);
      setBlend(1);
      setPrevStep(null);
      i = 0;
    }
    while (playRef.current && i < draft.steps.length - 1) {
      await animateTo(i + 1, draft.steps[i] ?? step);
      i += 1;
      if (!playRef.current) break;
    }
    setPlaying(false);
  };

  const onNext = () => {
    goToResultOf(step, stepIndex);
  };

  const toggleTag = (tag: PlayTag) => {
    patch((p) => ({
      ...p,
      tags: p.tags.includes(tag)
        ? p.tags.filter((t) => t !== tag)
        : [...p.tags, tag],
    }));
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-transparent pb-[env(safe-area-inset-bottom)]">
      <header className="flex items-center gap-2 bg-[#f4f1eb] px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
        <button
          type="button"
          className="mc-iconbtn shrink-0"
          aria-label={t("edit.back")}
          onClick={() => navigate({ to: "/playbook" })}
        >
          <ChevronLeft className="size-5" />
        </button>
        <Input
          value={draft.name}
          onChange={(e) => patch((p) => ({ ...p, name: e.target.value }))}
          className="mc-headline h-12 border-0 bg-transparent px-1 text-[28px] shadow-none focus-visible:ring-0"
          aria-label={t("edit.playName")}
        />
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => {
            savePlay(draft);
            toast(t("edit.saved"));
          }}
        >
          {t("edit.save")}
        </Button>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-2">
        <Seg
          a={t("edit.half")}
          b={t("edit.full")}
          value={draft.court === "half" ? "a" : "b"}
          onChange={(v) =>
            patch((p) => ({ ...p, court: v === "a" ? "half" : "full" }))
          }
        />
        <Seg
          a={t("edit.offense")}
          b={t("edit.defense")}
          value={placeSide === "offense" ? "a" : "b"}
          onChange={(v) => setPlaceSide(v === "a" ? "offense" : "defense")}
        />
      </div>

      <div className="relative px-3">
        <div className="mc-card overflow-hidden p-1.5" style={{ borderRadius: 18 }}>
          <div className="overflow-hidden rounded-[12px]">
          <CourtCanvas
            court={draft.court}
            step={step}
            prevStep={prevStep}
            blend={blend}
            tool={tool}
            placeSide={placeSide}
            interactive={!playing}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={updateStep}
            onTool={setTool}
            labelFor={labelFor}
          />
          </div>
          {empty && (
            <p className="pointer-events-none absolute inset-x-4 bottom-3 text-center text-xs text-court-line/80">
              {t("edit.emptyHint")}
            </p>
          )}
          {!empty && selectedId && step.drawings.some((d) => d.id === selectedId) ? (
            <p className="pointer-events-none absolute inset-x-4 bottom-3 text-center text-xs text-court-line/80">
              {t("edit.curveHint")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex gap-1 overflow-x-auto no-scrollbar px-3">
        {TOOL_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTool(id)}
            className={cn("shrink-0 text-xs", tool === id ? "mc-chip-on" : "mc-chip")}
          >
            {t(TOOL_KEYS[id])}
          </button>
        ))}
        <button
          type="button"
          onClick={undoStroke}
          className="mc-iconbtn size-11 shrink-0"
          aria-label={t("edit.undo")}
        >
          <Redo className="size-4 -scale-x-100" />
        </button>
        {selectedId && selectedId !== "__ball__" ? (
          <button
            type="button"
            onClick={removeSelected}
            className="inline-flex h-11 shrink-0 items-center gap-1 rounded-md bg-danger/15 px-3 text-xs text-danger"
          >
            <Trash2 className="size-3.5" />
            {selectedId === "__ball__"
              ? t("edit.tool.ball")
              : step.players.some((p) => p.id === selectedId)
                ? t("edit.player")
                : t("edit.line")}
          </button>
        ) : null}
        {selectedId && step.players.some((p) => p.id === selectedId) ? (
          <button
            type="button"
            onClick={() => updateStep({ ...step, ballId: selectedId })}
            className={cn(
              "inline-flex h-11 shrink-0 items-center rounded-md px-3 text-xs font-medium",
              step.ballId === selectedId ||
                (!step.ballId &&
                  step.players.find((p) => p.id === selectedId)?.n === 1 &&
                  step.players.find((p) => p.id === selectedId)?.side === "offense")
                ? "bg-accent text-accent-fg"
                : "bg-raised text-muted",
            )}
          >
            {t("edit.hasBall")}
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-2 px-3">
        <p className="mc-num text-[28px]">
          {stepIndex + 1}
          <span className="text-[#5f6680]">/{draft.steps.length}</span>
        </p>
        <div className="ml-auto flex gap-1">
          <button type="button" className="mc-tile" aria-label={t("edit.addStep")} onClick={addStep}>
            <Plus className="size-4" />
          </button>
          <button type="button" className="mc-tile" aria-label={t("edit.dupStep")} onClick={duplicateStep}>
            <Copy className="size-4" />
          </button>
          <button type="button" className="mc-tile" aria-label={t("edit.delStep")} onClick={deleteStep}>
            <Trash2 className="size-4" />
          </button>
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
            aria-label={playing ? t("edit.pause") : t("edit.play")}
            onClick={() => void onPlay()}
          >
            {playing ? (
              <Pause className="size-4" />
            ) : (
              <PlayIcon className="size-4 ml-0.5" />
            )}
          </button>
          <button type="button" className="mc-tile" aria-label={t("edit.next")} onClick={onNext}>
            <SkipForward className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 px-3 pb-8">
        <div className="mc-card p-3">
          <Label htmlFor="job">{t("edit.job")}</Label>
          <Textarea
            id="job"
            className="mt-1 min-h-20"
            placeholder={t("edit.jobPh")}
            value={draft.note}
            onChange={(e) => patch((p) => ({ ...p, note: e.target.value }))}
          />
        </div>
        <div className="mc-card p-3">
          <Label>{t("edit.stepNote")}</Label>
          <Input
            className="mt-1"
            placeholder={t("edit.stepPh")}
            value={step.note}
            onChange={(e) => updateStep({ ...step, note: e.target.value })}
          />
        </div>
        <div className="mc-card p-3">
          <label className="flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              className="size-4 accent-[var(--color-accent)]"
              checked={!!draft.useRosterNames}
              onChange={(e) => {
                const on = e.target.checked;
                patch((p) => ({
                  ...p,
                  useRosterNames: on,
                  rosterSlots:
                    on && !Object.keys(p.rosterSlots ?? {}).length
                      ? defaultRosterSlots(roster)
                      : p.rosterSlots,
                }));
              }}
            />
            <span className="text-sm text-fg">{t("edit.useRoster")}</span>
          </label>
          {draft.useRosterNames ? (
            <div className="mt-3 space-y-3">
              <Seg
                a={t("edit.hash")}
                b={t("edit.nameLabel")}
                value={draft.rosterLabel === "name" ? "b" : "a"}
                onChange={(v) =>
                  patch((p) => ({ ...p, rosterLabel: v === "b" ? "name" : "number" }))
                }
              />
              {roster.length === 0 ? (
                <p className="text-xs text-muted">
                  {t("edit.rosterEmpty")}
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {SLOT_LIST.map((n) => (
                    <div key={n} className="grid grid-cols-[2rem_1fr] items-center gap-2">
                      <span className="text-center font-display text-lg text-accent">{n}</span>
                      <NativeSelect
                        value={draft.rosterSlots?.[n] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          patch((p) => {
                            const slots = { ...p.rosterSlots };
                            if (value) slots[n] = value;
                            else delete slots[n];
                            return { ...p, rosterSlots: slots };
                          });
                        }}
                        aria-label={`Roster for ${n}`}
                      >
                        <option value="">{t("edit.jersey", { n })}</option>
                        {roster.map((r) => (
                          <option key={r.id} value={r.id}>
                            #{r.number} {r.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
        <div>
          <Label>{t("edit.tags")}</Label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PLAY_TAGS.map((tag) => {
              const on = draft.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn("text-xs", on ? "mc-chip-on" : "mc-chip")}
                >
                  {t(`tag.${tag}` as Msg)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mc-card grid grid-cols-2 gap-2 p-3">
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                const packed = await packPlay(draft);
                setShareUrl(packed.url);
                setShareTooLong(packed.tooLong);
                setShareOpen(true);
                if (!packed.tooLong) {
                  try {
                    await navigator.clipboard.writeText(packed.url);
                    toast(t("edit.shareCopied"));
                  } catch {
                    /* dialog still open */
                  }
                }
              } catch {
                setShareUrl("");
                setShareTooLong(true);
                setShareOpen(true);
                toast(t("edit.shareFail"));
              }
            }}
          >
            <Link2 className="size-4" />
            {t("edit.share")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              void downloadPlaySheetPng(draft, settings, labelFor);
              toast(t("edit.pngDown"));
            }}
          >
            <Download className="size-4" />
            {t("edit.png")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => printPlaySheet(draft, settings, labelFor)}
          >
            <Printer className="size-4" />
            {t("edit.print")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const id = duplicatePlay(draft.id);
              if (id) {
                toast(t("edit.dupOk"));
                void navigate({ to: "/playbook/$playId", params: { playId: id } });
              }
            }}
          >
            <Copy className="size-4" />
            {t("edit.duplicate")}
          </Button>
          <Button variant="danger" className="col-span-2" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" />
            {t("edit.delete")}
          </Button>
        </div>
      </div>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent title={t("edit.shareTitle")}>
          {shareTooLong ? (
            <p className="text-sm text-muted">
              {t("edit.shareTooLong")}
            </p>
          ) : (
            <p className="text-sm text-muted">
              {t("edit.shareOk")}
            </p>
          )}
          {!shareTooLong ? (
            <Input
              className="mt-3"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              aria-label={t("edit.shareLink")}
            />
          ) : null}
          <div className="mt-4 flex flex-col gap-2">
            {!shareTooLong ? (
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    toast(t("edit.copied"));
                  } catch {
                    toast(t("edit.copyFail"));
                  }
                }}
              >
                {t("edit.copy")}
              </Button>
            ) : null}
            <Button
              variant="secondary"
              onClick={() => {
                downloadText(
                  `${slugFile(draft.name)}.json`,
                  playToJson(draft),
                  "application/json",
                );
                toast(t("edit.fileDown"));
              }}
            >
              <Download className="size-4" />
              {t("edit.downloadFile")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent
          title={t("edit.delTitle")}
          description={t("edit.delBody")}
          onConfirm={() => {
            deletePlay(draft.id);
            void navigate({ to: "/playbook" });
          }}
        />
      </AlertDialog>
    </div>
  );
}

function Seg({
  a,
  b,
  value,
  onChange,
}: {
  a: string;
  b: string;
  value: "a" | "b";
  onChange: (v: "a" | "b") => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      {(["a", "b"] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={cn(value === k ? "mc-chip-on" : "mc-chip")}
        >
          {k === "a" ? a : b}
        </button>
      ))}
    </div>
  );
}

export function PlayThumb({ play, className }: { play: Play; className?: string }) {
  const roster = useAppStore((s) => s.settings.roster);
  const labelFor = useMemo(() => makeLabeler(play, roster), [play, roster]);
  const step = play.steps[0];
  if (!step) return null;
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-court",
        play.court === "half" ? "aspect-half" : "aspect-full",
        className,
      )}
    >
      <CourtCanvas court={play.court} step={step} labelFor={labelFor} />
    </div>
  );
}

export function TagRow({ tags }: { tags: PlayTag[] }) {
  const tr = useT();
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span key={tag} className="mc-tag">
          {tr(`tag.${tag}` as Msg)}
        </span>
      ))}
    </div>
  );
}
