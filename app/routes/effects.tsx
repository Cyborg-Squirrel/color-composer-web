import { Button, Space, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import EffectsTable from "~/components/effects/EffectsTable";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { isMobileUi } from '~/components/util/IsMobile';
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Effects | Color Composer" },
    { name: "description", content: "Effects" },
  ];
}

export default function Effects() {
  const [search, setSearch] = useState('');
  const isMobile = isMobileUi();

  const searchBar = (
    <TextInput
      data-testid="effects-search"
      placeholder="Search effects"
      value={search}
      onChange={(e) => setSearch(e.currentTarget.value)}
      leftSection={<MagnifyingGlassIcon size={16} />}
      w={isMobile ? '100%' : '40%'}
      size="md"
    />
  );

  const addButton = <Button data-testid="effects-add-btn">Add effect</Button>;

  return <Layout>
    <BasicAppShell title="Color Composer" pageName="Effects" topPadding={"sm"} boxCssEnabled={true} searchBar={searchBar} addButton={addButton}>
      <EffectsTable search={search} />
    </BasicAppShell>
    {/* Padding to give space for media control affix at the bottom of the screen */}
    <Space h="xl"/>
    <Space h="xl"/>
  </Layout>;
}
