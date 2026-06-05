import EffectsSplitPane from "~/components/effects/EffectsSplitPane";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Effects | Color Composer" },
    { name: "description", content: "Effects" },
  ];
}

export default function Effects() {
  return (
    <Layout>
      <BasicAppShell title="Color Composer" pageName="Effects" fullHeight>
        <EffectsSplitPane />
      </BasicAppShell>
    </Layout>
  );
}
