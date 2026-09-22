import { createFileRoute } from "@tanstack/react-router";
import { HostLogin } from "@/pages/host/HostLogin";

export const Route = createFileRoute("/host/login")({
  component: HostLogin,
});
