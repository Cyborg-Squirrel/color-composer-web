import { ClientGrid } from "~/components/clients/ClientGrid";
import { BasicAppShell } from "~/components/layouts/AppShell";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Color Composer" },
    { name: "description", content: "Home" },
  ];
}

export default function Home() {
  return <BasicAppShell title="Color Composer" pageName="Home" content={<ClientGrid />} topPadding={"lg"} disableContentBoxCss contentMarginTop={0}/>;
}
