import BasicAppShell from "~/components/layouts/BasicAppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Effects | Color Composer" },
    { name: "description", content: "Effects" },
  ];
}

export default function Effects() {
  return <BasicAppShell title="Color Composer" pageName="Effects" topPadding={"sm"} boxCssEnabled={true}/>;
}
