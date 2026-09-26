import { useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Copy,
  Plus,
  Printer,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, SheetContent } from "@/components/ui/dialog";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayThumb } from "@/components/play-editor";
import { printBenchCard, printPlanSheet } from "@/lib/print";
import { makeLabeler } from "@/lib/roster";
import { planMinutes, useAppStore } from "@/lib/store";
import type { BlockType, PracticeBlock, PracticePlan } from "@/lib/types";
import { BLOCK_TYPES } from "@/lib/types";
import { youth90Template } from "@/lib/samples";
import { cn, uid } from "@/lib/utils";
import { useT } from "@/lib/use-t";
import type { Msg } from "@/lib/i18n";

export function PlanEditor({ planId }: { planId: string }) {
  const navigate = useNavigate();
  const savePlan = useAppStore((s) => s.savePlan);
  const deletePlan = useAppStore((s) => s.deletePlan);
  const duplicatePlan = useAppStore((s) => s.duplicatePlan);
  const plays = useAppStore((s) => s.plays);
  const settings = useAppStore((s) => s.settings);
  const t = useT();
  const [draft, setDraft] = useState<PracticePlan | null>(null);
  const [pickPlay, setPickPlay] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const p = useAppStore.getState().plans.find((x) => x.id === planId);
    setDraft(p ? structuredClone(p) : null);
  }, [planId]);

  useEffect(() => {
    if (!draft) return;
    const t = window.setTimeout(() => savePlan(draft), 280);
    return () => window.clearTimeout(t);
  }, [draft, savePlan]);

  const total = draft ? planMinutes(draft) : 0;
  const mismatch = draft ? total !== draft.targetMinutes : false;

  if (!draft) {
    return (
      <div className="px-4 py-16 text-center text-muted">
        {t("plan.notFound")}
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate({ to: "/practices" })}>
            {t("plan.back")}
          </Button>
        </div>
      </div>
    );
  }

  const patch = (fn: (p: PracticePlan) => PracticePlan) =>
    setDraft((d) => (d ? fn(d) : d));

  const addBlock = (block?: Partial<PracticeBlock>) => {
    const next: PracticeBlock = {
      id: uid("bk"),
      title: block?.title ?? t("plan.newBlock"),
      minutes: block?.minutes ?? 8,
      type: block?.type ?? "drill",
      notes: block?.notes ?? "",
      playId: block?.playId,
      equipment: block?.equipment ?? "",
      cue: block?.cue ?? "",
    };
    patch((p) => ({ ...p, blocks: [...p.blocks, next] }));
  };

  const updateBlock = (id: string, next: Partial<PracticeBlock>) => {
    patch((p) => ({
      ...p,
      blocks: p.blocks.map((b) => (b.id === id ? { ...b, ...next } : b)),
    }));
  };

  const move = (index: number, dir: -1 | 1) => {
    patch((p) => {
      const blocks = [...p.blocks];
      const j = index + dir;
      if (j < 0 || j >= blocks.length) return p;
      const tmp = blocks[index];
      blocks[index] = blocks[j];
      blocks[j] = tmp;
      return { ...p, blocks };
    });
  };

  const fillYouth = () => {
    const first = plays[0]?.id;
    patch((p) => ({
      ...p,
      name: p.name === t("plan.newName") ? t("plan.youthName") : p.name,
      targetMinutes: 90,
      blocks: youth90Template(first).map((b) => ({ ...b, id: uid("bk") })),
    }));
    toast(t("plan.youthOk"));
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg pb-[env(safe-area-inset-bottom)]">
      <header className="flex items-center gap-1 px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("edit.back")}
          onClick={() => navigate({ to: "/practices" })}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Input
          value={draft.name}
          onChange={(e) => patch((p) => ({ ...p, name: e.target.value }))}
          className="h-11 border-0 bg-transparent px-1 font-display text-lg tracking-tight"
          aria-label={t("plan.name")}
        />
        <Button
          size="sm"
          onClick={() => {
            savePlan(draft);
            toast(t("edit.saved"));
          }}
        >
          {t("edit.save")}
        </Button>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4">
        <div>
          <Label htmlFor="date">{t("plan.date")}</Label>
          <Input
            id="date"
            type="date"
            className="mt-1"
            value={draft.date}
            onChange={(e) => patch((p) => ({ ...p, date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="target">{t("plan.minutes")}</Label>
          <Input
            id="target"
            type="number"
            min={15}
            max={180}
            className="mt-1"
            value={draft.targetMinutes}
            onChange={(e) =>
              patch((p) => ({
                ...p,
                targetMinutes: Number(e.target.value) || 0,
              }))
            }
          />
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-xl text-fg">{t("plan.timeline")}</p>
          <p
            className={cn(
              "text-sm tabular-nums",
              mismatch ? "text-warn" : "text-muted",
            )}
          >
            {total} / {draft.targetMinutes} {t("home.min")}
            {mismatch ? t("plan.mismatchShort") : ""}
          </p>
        </div>
        {mismatch ? (
          <p className="mt-1 text-xs text-warn">
            {t("plan.mismatch")}
          </p>
        ) : null}
      </div>

      <ol className="mt-3 flex flex-col gap-3 px-4">
        {draft.blocks.map((block, i) => {
          const linked = plays.find((p) => p.id === block.playId);
          return (
            <li
              key={block.id}
              className="rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]"
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-raised"
                    aria-label={t("plan.moveUp")}
                    onClick={() => move(i, -1)}
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-md text-muted hover:bg-raised"
                    aria-label={t("plan.moveDown")}
                    onClick={() => move(i, 1)}
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Input
                    value={block.title}
                    onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                    aria-label={t("plan.blockTitle")}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <NativeSelect
                      value={block.type}
                      onChange={(e) =>
                        updateBlock(block.id, { type: e.target.value as BlockType })
                      }
                    >
                      {BLOCK_TYPES.map((bt) => (
                        <option key={bt} value={bt}>
                          {t(`block.${bt}` as Msg)}
                        </option>
                      ))}
                    </NativeSelect>
                    <Input
                      type="number"
                      min={1}
                      max={90}
                      value={block.minutes}
                      onChange={(e) =>
                        updateBlock(block.id, {
                          minutes: Number(e.target.value) || 0,
                        })
                      }
                      aria-label={t("plan.mins")}
                    />
                  </div>
                  <Textarea
                    className="min-h-16"
                    placeholder={t("plan.notes")}
                    value={block.notes}
                    onChange={(e) => updateBlock(block.id, { notes: e.target.value })}
                  />
                  <Input
                    placeholder={t("plan.equip")}
                    value={block.equipment ?? ""}
                    onChange={(e) => updateBlock(block.id, { equipment: e.target.value })}
                    aria-label={t("plan.equip")}
                  />
                  <Input
                    placeholder={t("plan.cue")}
                    value={block.cue ?? ""}
                    onChange={(e) => updateBlock(block.id, { cue: e.target.value })}
                    aria-label={t("plan.cue")}
                  />
                  {linked ? (
                    <div className="flex items-center gap-2 rounded-md bg-raised p-2">
                      <div className="w-20 shrink-0">
                        <PlayThumb play={linked} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-fg">{linked.name}</p>
                        <p className="text-xs text-muted">{t("plan.linked")}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateBlock(block.id, { playId: undefined })}
                      >
                        {t("plan.unlink")}
                      </Button>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="inline-flex size-10 items-center justify-center rounded-md text-danger hover:bg-raised"
                  aria-label={t("plan.remove")}
                  onClick={() =>
                    patch((p) => ({
                      ...p,
                      blocks: p.blocks.filter((b) => b.id !== block.id),
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-col gap-2 px-4 pb-10">
        <Button variant="secondary" onClick={() => addBlock()}>
          <Plus className="size-4" />
          {t("plan.addBlock")}
        </Button>
        <Button variant="secondary" onClick={() => setPickPlay(true)}>
          {t("plan.fromBook")}
        </Button>
        <Button variant="outline" onClick={fillYouth}>
          {t("plan.build90")}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const id = duplicatePlan(draft.id);
            if (id) {
              toast(t("plan.dupOk"));
              void navigate({ to: "/practices/$planId", params: { planId: id } });
            }
          }}
        >
          <Copy className="size-4" />
          {t("plan.dup")}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => printPlanSheet(draft, plays, settings)}
          >
            <Printer className="size-4" />
            {t("plan.gym")}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              printBenchCard(draft, plays, settings, (play) =>
                makeLabeler(play, settings.roster),
              )
            }
          >
            <Printer className="size-4" />
            {t("plan.bench")}
          </Button>
        </div>
        <Button
          onClick={() =>
            navigate({
              to: "/practices/$planId/run",
              params: { planId: draft.id },
            })
          }
          disabled={!draft.blocks.length}
        >
          {t("plan.run")}
        </Button>
        <Button variant="danger" onClick={() => setConfirmDelete(true)}>
          {t("plan.delete")}
        </Button>
      </div>

      <Dialog open={pickPlay} onOpenChange={setPickPlay}>
        <SheetContent title={t("plan.fromBook")}>
          <p className="mt-1 text-sm text-muted">{t("plan.fromHint")}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {plays.map((play) => (
              <li key={play.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg bg-raised p-2 text-left"
                  onClick={() => {
                    addBlock({
                      title: t("plan.teach", { name: play.name }),
                      minutes: 8,
                      type: "play review",
                      notes: t("plan.teachNotes"),
                      playId: play.id,
                    });
                    setPickPlay(false);
                  }}
                >
                  <div className="w-20 shrink-0">
                    <PlayThumb play={play} />
                  </div>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-fg">{play.name}</span>
                    <span className="text-xs text-muted">
                      {play.tags.join(" · ") || t("plan.untagged")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent
          title={t("plan.delTitle")}
          description={t("plan.delBody")}
          onConfirm={() => {
            deletePlan(draft.id);
            void navigate({ to: "/practices" });
          }}
        />
      </AlertDialog>
    </div>
  );
}

export function PlanMeta({ plan }: { plan: PracticePlan }) {
  const t = useT();
  const total = planMinutes(plan);
  const mismatch = total !== plan.targetMinutes;
  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge tone={mismatch ? "warn" : "mute"}>
        {total}/{plan.targetMinutes} {t("home.min")}
      </Badge>
      <span className="text-faint">{t("home.blocks", { n: plan.blocks.length })}</span>
    </div>
  );
}

export function BlockTypeBadge({ type }: { type: BlockType }) {
  const t = useT();
  return <Badge>{t(`block.${type}` as Msg)}</Badge>;
}

export function usePlan(planId: string) {
  return useAppStore((s) => s.plans.find((p) => p.id === planId));
}
