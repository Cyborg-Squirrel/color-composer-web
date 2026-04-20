import { useEffect, useState } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import AddStripButton from "~/components/strips/AddStripButton";
import { StripsTable } from "~/components/strips/StripsTable";
import { useClientApi } from "~/provider/ClientApiContext";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "LED Strips | Color Composer" },
    { name: "description", content: "LED Strips" },
  ];
}

export default function Strips() {
  return <Layout>
    <StripsContainer />
  </Layout>;
}

// Wrapped by Strips() to enable API provider
function StripsContainer() {
  const clientApi = useClientApi();
  const [clients, setClients] = useState<ILedStripClient[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    clientApi.getClients().then(setClients).catch(err => {
      console.error('Error fetching clients', err);
    });
  }, [refreshKey]);

  return <BasicAppShell title="Color Composer" pageName="Strips" topPadding={"sm"} boxCssEnabled={true}
    addButton={<AddStripButton clients={clients ?? []} onSuccess={() => setRefreshKey(k => k + 1)} />}>
    <StripsTable clients={clients} refreshKey={refreshKey} />
  </BasicAppShell>;
}
