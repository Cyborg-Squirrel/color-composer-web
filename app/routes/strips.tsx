import { BasicAppShell } from "~/components/layouts/AppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LED Strips | Color Composer" },
    { name: "description", content: "LED Strips" },
  ];
}

export default function Strips() {
  return <BasicAppShell title="Color Composer" pageName="Strips" content={<div/>} topPadding={"sm"}/>;
}
