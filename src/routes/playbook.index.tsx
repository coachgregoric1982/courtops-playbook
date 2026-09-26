import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PlayThumb, TagRow } from "@/components/play-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parsePlayFile } from "@/lib/share";
import { useAppStore } from "@/lib/store";
import { PLAY_TAGS, type PlayTag } from "@/lib/types";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";
import type { Msg } from "@/lib/i18n";

export const Route = createFileRoute("/playbook/")({ component: Playbook });

function Playbook() {
  const navigate = useNavigate();
  const t = useT();
  const plays = useAppStore((s) => s.plays);
  const createPlay = useAppStore((s) => s.createPlay);
  const importPlay = useAppStore((s) => s.importPlay);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<PlayTag | "all">("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return plays.filter((p) => {
      const hitQ =
        !q.trim() ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.note.toLowerCase().includes(q.toLowerCase());
      const hitT = tag === "all" || p.tags.includes(tag);
      return hitQ && hitT;
    });
  }, [plays, q, tag]);

  return (
    <AppShell>
      <PageHeader
        kicker={t("playbook.kicker")}
        title={t("playbook.title")}
        action={
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" />
              {t("playbook.import")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const id = createPlay(t("home.newPlay"));
                void navigate({ to: "/playbook/$playId", params: { playId: id } });
              }}
            >
              <Plus className="size-4" />
              {t("playbook.new")}
            </Button>
          </div>
        }
      />
      <div className="px-4">
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              const play = parsePlayFile(await file.text());
              const id = importPlay(play);
              toast(t("playbook.imported"));
              void navigate({ to: "/playbook/$playId", params: { playId: id } });
            } catch {
              toast(t("playbook.importFail"));
            }
          }}
        />
        <Input
          placeholder={t("playbook.search")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={t("playbook.search")}
        />
        <div className="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <Chip on={tag === "all"} onClick={() => setTag("all")}>
            {t("playbook.all")}
          </Chip>
          {PLAY_TAGS.map((tg) => (
            <Chip key={tg} on={tag === tg} onClick={() => setTag(tg)}>
              {t(`tag.${tg}` as Msg)}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-muted">{t("playbook.empty")}</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3 px-4 pb-8">
          {filtered.map((play) => (
            <li key={play.id}>
              <Link
                to="/playbook/$playId"
                params={{ playId: play.id }}
                className="mc-card block overflow-hidden"
              >
                <PlayThumb play={play} className="rounded-none rounded-t-[21px] max-h-48" />
                <div className="space-y-2 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="mc-headline min-w-0 truncate text-[28px]">{play.name}</h2>
                    <span className="mc-num shrink-0 text-[22px] text-[var(--color-accent)]">
                      {play.steps.length}
                    </span>
                  </div>
                  <TagRow tags={play.tags} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("mc-chip shrink-0", on && "mc-chip-on")}
    >
      {children}
    </button>
  );
}
