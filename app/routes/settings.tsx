import BasicAppShell from "~/components/layouts/BasicAppShell";
import { isMobileUi } from "~/context/IsMobileContext";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | Color Composer" },
    { name: "description", content: "Settings" },
  ];
}

export default function Settings() {
  const isMobile = isMobileUi();
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Settings" topPadding={"sm"} boxCssEnabled={!isMobile}/>
  </UiContext>;
}
