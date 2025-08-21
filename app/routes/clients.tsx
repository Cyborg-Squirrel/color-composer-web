import { ClientTable } from "~/components/clients/ClientTable";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { isMobileUi } from "~/context/IsMobileContext";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clients | Color Composer" },
    { name: "description", content: "Clients" },
  ];
}

export default function Clients() {
  const isMobile = isMobileUi();
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Clients" topPadding={"sm"} boxCssEnabled={!isMobile}>
        <ClientTable/>
      </BasicAppShell>
  </UiContext>;
}
