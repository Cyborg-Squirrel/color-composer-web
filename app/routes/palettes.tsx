import { BasicAppShell } from "~/components/layouts/BasicAppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Palettes | Color Composer" },
    { name: "description", content: "Palettes" },
  ];
}

export default function Palettes() {
  return <BasicAppShell title="Color Composer" pageName="Palettes" content={<div/>} topPadding={"sm"}/>;
}
