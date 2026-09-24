import { createFileRoute } from "@tanstack/react-router";
import { PlanEditor } from "@/components/plan-editor";

export const Route = createFileRoute("/practices/$planId/")({
  component: PlanEditorPage,
});

function PlanEditorPage() {
  const { planId } = Route.useParams();
  return <PlanEditor planId={planId} />;
}
