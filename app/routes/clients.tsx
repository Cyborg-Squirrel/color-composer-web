import { useState } from "react";
import AddClientButton from "~/components/clients/AddClientButton";
import ClientList from "~/components/clients/ClientList";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Clients | Color Composer" },
    { name: "description", content: "Clients" },
  ];
}

export default function Clients() {
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <Layout>
      <BasicAppShell
        title="Color Composer"
        pageName="Clients"
        topPadding="xs"
        containerSize="md"
        boxCssEnabled={false}
        addButton={<AddClientButton onSuccess={bump} />}
      >
        <ClientList refreshKey={refreshKey} onClientChanged={bump} />
      </BasicAppShell>
    </Layout>
  );
}
