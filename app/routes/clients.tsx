import { BasicAppShell } from "~/components/AppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clients | Color Composer" },
    { name: "description", content: "Clients" },
  ];
}

export default function Clients() {
  return <BasicAppShell title="Color Composer" selectedNavItemText="clients" />;
}
