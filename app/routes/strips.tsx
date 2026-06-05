import { Group, Tabs } from "@mantine/core";
import { LightbulbIcon, StackIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { ILedStripClient } from "~/api/clients/clients_api";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import AddStripButton from "~/components/strips/AddStripButton";
import NewPoolButton from "~/components/strips/NewPoolButton";
import StripList, { type StripListTab } from "~/components/strips/StripList";
import { useClientApi } from "~/provider/ClientApiContext";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Strips & Pools | Color Composer" },
    { name: "description", content: "Strips & Pools" },
  ];
}

export default function Strips() {
  return (
    <Layout>
      <StripsContainer />
    </Layout>
  );
}

function StripsContainer() {
  const clientApi = useClientApi();
  const location = useLocation();
  const initialTab: StripListTab = (location.state as { tab?: StripListTab } | null)?.tab === "pools" ? "pools" : "strips";
  const [tab, setTab] = useState<StripListTab>(initialTab);
  const [clients, setClients] = useState<ILedStripClient[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    clientApi.getClients().then(setClients).catch((err) => console.error("Error fetching clients", err));
  }, [refreshKey, clientApi]);

  const addButton =
    tab === "strips" ? (
      <AddStripButton clients={clients} onSuccess={bump} />
    ) : (
      <NewPoolButton onSuccess={bump} />
    );

  return (
    <BasicAppShell
      title="Color Composer"
      pageName="Strips"
      topPadding="xs"
      containerSize="md"
      boxCssEnabled={false}
      addButton={addButton}
    >
      <Group justify="flex-start" mb="md">
        <Tabs value={tab} onChange={(v) => v && setTab(v as StripListTab)} variant="default" style={{ width: "100%" }}>
          <Tabs.List>
            <Tabs.Tab
              data-testid="strips-tab-strips"
              value="strips"
              leftSection={<LightbulbIcon size={14} />}
            >
              Strips
            </Tabs.Tab>
            <Tabs.Tab
              data-testid="strips-tab-pools"
              value="pools"
              leftSection={<StackIcon size={14} />}
            >
              Pools
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Group>
      <StripList tab={tab} refreshKey={refreshKey} onChanged={bump} />
    </BasicAppShell>
  );
}
