import { isMobileUi } from "~/components/IsMobileContext";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/components/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Palettes | Color Composer" },
    { name: "description", content: "Palettes" },
  ];
}

export default function Palettes() {
  const isMobile = isMobileUi();
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Palettes" topPadding={"sm"} boxCssEnabled={!isMobile}/>
  </UiContext>;
}
