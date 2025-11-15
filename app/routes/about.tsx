import BasicAppShell from "~/components/layouts/BasicAppShell";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About | Color Composer" },
    { name: "description", content: "About" },
  ];
}

export default function About() {
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="About" topPadding={"sm"} boxCssEnabled={true}/>
  </UiContext>;
}
