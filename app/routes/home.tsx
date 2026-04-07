import { ClientGrid } from "~/components/clients/ClientGrid";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Home | Color Composer" },
    { name: "description", content: "Home" },
  ];
}

export default function Home() {
  return <Layout>
    <BasicAppShell title="Color Composer" pageName="Home" topPadding={"lg"} boxCssEnabled={false} contentMarginTop={0}>
      <ClientGrid />
    </BasicAppShell>
  </Layout>;
}
