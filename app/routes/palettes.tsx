import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Palettes | Color Composer" },
    { name: "description", content: "Palettes" },
  ];
}

export default function Palettes() {
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Palettes" topPadding={"sm"} boxCssEnabled={true}/>
  </UiContext>;
}
