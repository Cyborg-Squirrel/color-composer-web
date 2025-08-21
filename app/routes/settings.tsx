import { BasicAppShell } from "~/components/layouts/BasicAppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | Color Composer" },
    { name: "description", content: "Settings" },
  ];
}

export default function Settings() {
  return <BasicAppShell title="Color Composer" pageName="Settings" content={<div/>} topPadding={"sm"}/>;
}
