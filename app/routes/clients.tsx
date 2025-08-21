import { ClientTable } from "~/components/clients/ClientTable";
import { isMobileUi } from "~/components/IsMobileContext";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/components/UiContext";
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
