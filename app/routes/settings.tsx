import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings | Color Composer" },
    { name: "description", content: "Settings" },
  ];
}

export default function Settings() {
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Settings" topPadding={"sm"} boxCssEnabled={true}/>
  </UiContext>;
}
