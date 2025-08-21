import { StripsTable } from "~/components/clients/StripsTable";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { isMobileUi } from "~/context/IsMobileContext";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LED Strips | Color Composer" },
    { name: "description", content: "LED Strips" },
  ];
}

export default function Strips() {
  const isMobile = isMobileUi();
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Strips" topPadding={"sm"} boxCssEnabled={!isMobile}>
        <StripsTable/>
      </BasicAppShell>
  </UiContext>;
}
