import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import AddStripButton from "~/components/strips/AddStripButton";
import { StripsTable } from "~/components/strips/StripsTable";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LED Strips | Color Composer" },
    { name: "description", content: "LED Strips" },
  ];
}

export default function Strips() {
  const [clients, setClients] = useState<ILedStripClient[] | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getClients().then(setClients).catch(err => {
      console.error('Error fetching clients', err);
    });
  }, []);

  return <UiContext>
    <BasicAppShell title="Color Composer" pageName="Strips" topPadding={"sm"} boxCssEnabled={true}
      addButton={<AddStripButton clients={clients ?? []} onSuccess={() => setRefreshKey(k => k + 1)} />}>
      <StripsTable clients={clients} refreshKey={refreshKey} />
    </BasicAppShell>
  </UiContext>;
}
