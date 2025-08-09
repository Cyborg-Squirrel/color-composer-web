import { BasicAppShell } from "~/components/AppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Triggers | Color Composer" },
    { name: "description", content: "Triggers" },
  ];
}

export default function Triggers() {
  return <BasicAppShell title="Color Composer" selectedNavItemText="triggers" />;
}
