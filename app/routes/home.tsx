import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { ClientGrid } from "~/components/clients/ClientGrid";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Color Composer" },
    { name: "description", content: "Home" },
  ];
}

export default function Home() {
  const [clients, setClients] = useState<ILedStripClient[] | undefined>(undefined);

  useEffect(() => {
    getClients().then(setClients).catch(err => {
      console.error('Error fetching clients', err);
      setClients([]);
    });
  }, []);

  return <UiContext>
    <BasicAppShell title="Color Composer" pageName="Home" topPadding={"lg"} boxCssEnabled={false} contentMarginTop={0}>
      <ClientGrid clients={clients} />
    </BasicAppShell>
  </UiContext>;
}
