import { createFileRoute } from "@tanstack/react-router";
import { RunMode } from "@/components/run-mode";

export const Route = createFileRoute("/practices/$planId/run")({
  component: RunPage,
});

function RunPage() {
  const { planId } = Route.useParams();
  return <RunMode planId={planId} />;
}
