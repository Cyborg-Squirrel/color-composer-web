import BasicAppShell from "~/components/layouts/BasicAppShell";
import { StripsTable } from "~/components/strips/StripsTable";
import UiContext from "~/context/UiContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LED Strips | Color Composer" },
    { name: "description", content: "LED Strips" },
  ];
}

export default function Strips() {
  return <UiContext>
      <BasicAppShell title="Color Composer" pageName="Strips" topPadding={"sm"} boxCssEnabled={true}>
        <StripsTable/>
      </BasicAppShell>
  </UiContext>;
}
