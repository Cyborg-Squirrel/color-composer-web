import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About | Color Composer" },
    { name: "description", content: "About" },
  ];
}

export default function About() {
  return <Layout>
    <BasicAppShell title="Color Composer" pageName="About" topPadding={"sm"} boxCssEnabled={true}/>
  </Layout>;
}
