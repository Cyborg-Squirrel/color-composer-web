import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Triggers | Color Composer" },
    { name: "description", content: "Triggers" },
  ];
}

export default function Triggers() {
  return <Layout>
    <BasicAppShell title="Color Composer" pageName="Triggers" topPadding={"sm"} boxCssEnabled={true}/>
  </Layout>;
}
