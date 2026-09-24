import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/practices")({
  component: PracticesLayout,
});

function PracticesLayout() {
  return <Outlet />;
}
