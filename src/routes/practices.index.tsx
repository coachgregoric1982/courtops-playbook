import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { PlanMeta } from "@/components/plan-editor";
import { Button } from "@/components/ui/button";
import { LOCALE_META } from "@/lib/i18n";
import { formatDateLabel } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useLocale, useT } from "@/lib/use-t";

export const Route = createFileRoute("/practices/")({ component: Practices });

function Practices() {
  const navigate = useNavigate();
  const t = useT();
  const locale = useLocale();
  const plans = useAppStore((s) => s.plans);
  const createPlan = useAppStore((s) => s.createPlan);
  const buildYouth90 = useAppStore((s) => s.buildYouth90);

  const sorted = [...plans].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AppShell>
      <PageHeader
        kicker={t("plans.kicker")}
        title={t("plans.title")}
        action={
          <Button
            size="sm"
            onClick={() => {
              const id = createPlan();
              void navigate({ to: "/practices/$planId", params: { planId: id } });
            }}
          >
            <Plus className="size-4" />
            {t("plans.new")}
          </Button>
        }
      />

      <div className="px-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            const id = buildYouth90();
            void navigate({ to: "/practices/$planId", params: { planId: id } });
          }}
        >
          {t("plans.build90")}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-muted">{t("plans.empty")}</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3 px-4 pb-8">
          {sorted.map((plan) => (
            <li key={plan.id}>
              <Link
                to="/practices/$planId"
                params={{ planId: plan.id }}
                className="hw-card block p-4"
              >
                <p className="hw-label text-[#a8480a]">
                  {formatDateLabel(plan.date, LOCALE_META[locale].bcp47)}
                </p>
                <h2 className="hw-headline mt-1 text-[28px]">{plan.name}</h2>
                <div className="mt-2">
                  <PlanMeta plan={plan} />
                </div>
                <ol className="mt-3 space-y-1">
                  {plan.blocks.slice(0, 4).map((b) => (
                    <li key={b.id} className="flex justify-between text-sm text-muted">
                      <span className="truncate">{b.title}</span>
                      <span className="hw-num text-[20px]">{b.minutes}</span>
                    </li>
                  ))}
                  {plan.blocks.length > 4 ? (
                    <li className="text-xs text-faint">
                      {t("plans.more", { n: plan.blocks.length - 4 })}
                    </li>
                  ) : null}
                </ol>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
