import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Palettes | Color Composer" },
    { name: "description", content: "Palettes" },
  ];
}

export default function Palettes() {
  return <Layout>
    <BasicAppShell title="Color Composer" pageName="Palettes" topPadding={"sm"} boxCssEnabled={true}/>
  </Layout>;
}
