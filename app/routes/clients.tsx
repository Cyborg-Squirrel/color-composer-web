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
  return <UiContext>
    <BasicAppShell title="Color Composer" pageName="Clients" topPadding={"sm"} 
      boxCssEnabled={true} addButton={<AddClientButton/>}>
      <ClientTable />
    </BasicAppShell>
  </UiContext>;
}
