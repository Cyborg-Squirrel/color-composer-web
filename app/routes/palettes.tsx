import { useState } from "react";
import AddPaletteButton from "~/components/palettes/AddPaletteButton";
import { PalettesTable } from "~/components/palettes/PalettesTable";
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
  const handlePaletteMutated = () => setRefreshKey(k => k + 1);

  return (
    <Layout>
      <BasicAppShell
        title="Color Composer"
        pageName="Palettes"
        topPadding="sm"
        boxCssEnabled={true}
        addButton={<AddPaletteButton onSuccess={handlePaletteMutated} />}
      >
        <PalettesTable refreshKey={refreshKey} onPaletteMutated={handlePaletteMutated} />
      </BasicAppShell>
    </Layout>
  );
}
