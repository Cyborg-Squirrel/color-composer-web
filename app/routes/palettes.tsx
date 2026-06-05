import { useState } from "react";
import AddPaletteButton from "~/components/palettes/AddPaletteButton";
import PaletteGrid from "~/components/palettes/PaletteGrid";
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
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <Layout>
      <BasicAppShell
        title="Color Composer"
        pageName="Palettes"
        topPadding="xs"
        containerSize="md"
        boxCssEnabled={false}
        addButton={<AddPaletteButton onSuccess={bump} />}
      >
        <PaletteGrid refreshKey={refreshKey} onPaletteMutated={bump} />
      </BasicAppShell>
    </Layout>
  );
}
