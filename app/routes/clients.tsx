import { useState } from "react";
import AddClientButton from "~/components/clients/AddClientButton";
import ClientTable from "~/components/clients/ClientTable";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Clients | Color Composer" },
    { name: "description", content: "Clients" },
  ];
}

export default function Clients() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleClientMutated = () => setRefreshKey(k => k + 1);

  return <Layout>
    <BasicAppShell title="Color Composer" pageName="Clients" topPadding={"sm"}
      boxCssEnabled={true} addButton={<AddClientButton onSuccess={handleClientMutated} />}>
      <ClientTable refreshKey={refreshKey} onClientChanged={handleClientMutated} />
    </BasicAppShell>
  </Layout>;
}
