import { AppShell, Burger, Code, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navbar } from './Navbar';

export function BasicAppShell(props: { title: string; selectedNavItemText: string; }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      header={{ height: { base: 60, md: 65, lg: 70 } }}
      navbar={{
        width: { base: 200, md: 250, lg: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between">
          <Text id="title" fw={700} span>{ props.title }</Text>
          <Code id="version" fw={700}>v0.0.1</Code>
        </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Navbar selectedNavItemText={ props.selectedNavItemText }></Navbar>
      </AppShell.Navbar>
      <AppShell.Main>
        <Text>This is the main section, your app content here.</Text>
        <Text>Layout used in most cases – Navbar and Header with fixed position</Text>
      </AppShell.Main>
    </AppShell>
  );
}