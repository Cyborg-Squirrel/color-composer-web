import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Triggers | Color Composer" },
    { name: "description", content: "Triggers" },
  ];
}

export default function Triggers() {
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Triggers" topPadding={"sm"} boxCssEnabled={true}/>
  </UiContext>;
}
