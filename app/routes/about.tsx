import { isMobileUi } from "~/components/IsMobileContext";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/components/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About | Color Composer" },
    { name: "description", content: "About" },
  ];
}

export default function About() {
  const isMobile = isMobileUi();
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="About" topPadding={"sm"} boxCssEnabled={!isMobile}/>
  </UiContext>;
}
