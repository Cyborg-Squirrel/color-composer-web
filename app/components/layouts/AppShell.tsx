import { AppShell, Box, Burger, Code, Divider, Group, Space, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navbar } from './Navbar';

interface IAppShellProps {
  title: string;
  pageName: string;
  content: React.ReactNode;
  topPadding: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  hideDivider?: boolean;
  disableContentBoxCss?: boolean;
  contentMarginTop?: number;
}

export function BasicAppShell(props: IAppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  let boxClassName = props.disableContentBoxCss ? undefined : 'content-box';
  let cmt = props.contentMarginTop ?? 1.5;

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
        <Group h="100%" pl="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between">
          <Text id="title" fw={700} span>{ props.title }</Text>
          <Code id="version" fw={700}>v0.0.1</Code>
        </Group>
        </Group>
      </AppShell.Header>
      <Navbar selectedNavItemText={ props.pageName }/>
      <AppShell.Main>
        <Box className={boxClassName} p="1em" mt={cmt + 'em'} ml='.5em' mr='.5em'>
        <Title order={2}>{ props.pageName }</Title>
        <Space h="xs"></Space>
        <Divider hidden={props.hideDivider}></Divider>
        <Space h={props.topPadding}></Space>
        {props.content}
      </Box>
      </AppShell.Main>
    </AppShell>
  );
}