import { Space } from '@mantine/core';
import EffectsTable from "~/components/effects/EffectsTable";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Effects | Color Composer" },
    { name: "description", content: "Effects" },
  ];
}

export default function Effects() {
  return <Layout>
    <BasicAppShell title="Color Composer" pageName="Effects" topPadding={"sm"} boxCssEnabled={true}>
      <EffectsTable />
    </BasicAppShell>
    {/* Padding to give space for media control affix at the bottom of the screen */}
    <Space h="xl"/>
    <Space h="xl"/>
  </Layout>;
}
