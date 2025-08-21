import BasicAppShell from "~/components/layouts/BasicAppShell";
import { isMobileUi } from "~/context/IsMobileContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Effects | Color Composer" },
    { name: "description", content: "Effects" },
  ];
}

export default function Effects() {
  const isMobile = isMobileUi();
  return <BasicAppShell title="Color Composer" pageName="Effects" topPadding={"sm"} boxCssEnabled={!isMobile}/>;
}
