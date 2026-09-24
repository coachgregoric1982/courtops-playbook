import { createFileRoute } from "@tanstack/react-router";
import { PlayEditor } from "@/components/play-editor";

export const Route = createFileRoute("/playbook/$playId")({
  component: PlayEditorPage,
});

function PlayEditorPage() {
  const { playId } = Route.useParams();
  return <PlayEditor playId={playId} />;
}
