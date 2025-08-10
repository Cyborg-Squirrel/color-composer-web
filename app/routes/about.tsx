import { BasicAppShell } from "~/components/AppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About | Color Composer" },
    { name: "description", content: "About" },
  ];
}

export default function About() {
  return <BasicAppShell title="Color Composer" pageName="About" content={<div/>}/>;
}
