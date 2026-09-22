import { createFileRoute } from "@tanstack/react-router";
import { HostDashboard } from "@/pages/host/HostDashboard";

export const Route = createFileRoute("/host/dashboard")({
  component: HostDashboard,
});
