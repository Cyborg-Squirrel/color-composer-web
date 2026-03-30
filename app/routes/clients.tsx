import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import AddClientButton from "~/components/clients/AddClientButton";
import ClientTable from "~/components/clients/ClientTable";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Clients | Color Composer" },
    { name: "description", content: "Clients" },
  ];
}

export default function Clients() {
  const [clients, setClients] = useState<ILedStripClient[] | undefined>(undefined);
  const [strips, setStrips] = useState<ILedStrip[] | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Promise.all([getClients(), getStrips()])
      .then(([fetchedClients, fetchedStrips]) => {
        setClients(fetchedClients);
        setStrips(fetchedStrips);
      })
      .catch(err => {
        console.error('Error fetching data', err);
      });
  }, [refreshKey]);

  const handleClientMutated = () => setRefreshKey(k => k + 1);

  return <UiContext>
    <BasicAppShell title="Color Composer" pageName="Clients" topPadding={"sm"}
      boxCssEnabled={true} addButton={<AddClientButton onSuccess={handleClientMutated} />}>
      <ClientTable clients={clients} strips={strips} onClientChanged={handleClientMutated} />
    </BasicAppShell>
  </UiContext>;
}
