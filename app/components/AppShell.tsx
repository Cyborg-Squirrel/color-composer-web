import { AppShell, Burger, Code, Divider, Group, Space, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navbar } from './Navbar';

interface AppShellProps {
  title: string;
  pageName: string;
  content: React.ReactNode;
}

export function BasicAppShell(props: AppShellProps) {
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
      <Navbar selectedNavItemText={ props.pageName }/>
      <AppShell.Main style={{
        background:"var(--mantine-color-disabled)"
      }}>
        <Title order={2}>{ props.pageName }</Title>
        <Space h="xs"></Space>
        <Divider></Divider>
        <Space h="xl"></Space>
        {props.content}
      </AppShell.Main>
    </AppShell>
  );
}