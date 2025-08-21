import BasicAppShell from "~/components/layouts/BasicAppShell";
import { isMobileUi } from "~/context/IsMobileContext";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Triggers | Color Composer" },
    { name: "description", content: "Triggers" },
  ];
}

export default function Triggers() {
  const isMobile = isMobileUi();
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Triggers" topPadding={"sm"} boxCssEnabled={!isMobile}/>
  </UiContext>;
}
