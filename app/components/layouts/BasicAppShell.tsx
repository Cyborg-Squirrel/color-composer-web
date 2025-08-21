import { AppShell, Box, Burger, Code, Divider, Group, Space, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useContext, type ReactElement, type ReactNode } from 'react';
import { ColorSchemeToggle } from '../ColorSchemeToggle';
import { IsLightModeContext } from '../IsLightModeContext';
import { IsMobileContext } from '../IsMobileContext';
import { Navbar } from './Navbar';

interface IAppShellProps {
  title: string;
  pageName: string;
  children?: ReactNode;
  topPadding: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  hideDivider?: boolean;
  boxCssEnabled?: boolean;
  contentMarginTop?: number;
}

function BasicAppShell(props: IAppShellProps) {
  const isMobile = useContext(IsMobileContext);
  const isLightMode = useContext(IsLightModeContext);
  const [opened, { toggle }] = useDisclosure();
  let contentMarginTop = props.contentMarginTop ?? 1.5;
  let titlePadding = isMobile ? '.33em' : undefined;
  let boxCssEnabled = props.boxCssEnabled ?? true;

  let box = getBox(isMobile, (
    <div>
      <Title pl={titlePadding} pt={titlePadding} order={2}>{ props.pageName }</Title>
      <Space h="xs"></Space>
      <Divider hidden={props.hideDivider}></Divider>
      <Space h={props.topPadding}></Space>
      {props.children}
    </div>
    ),
    boxCssEnabled,
    contentMarginTop);

  return (
        <AppShell
        padding="md"
        header={{ height: { base: 60, md: 65, lg: 70 } }}
        navbar={{
          width: { base: 200, md: 250, lg: 300 },
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        withBorder={ isLightMode }
        >
        <AppShell.Header>
          <Group h="100%" pl="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group justify="space-between">
              <Text id="title" fw={700} span>{ props.title }</Text>
              <Code id="version" fw={700}>v0.0.1</Code>
            </Group>
            <ColorSchemeToggle hidden={import.meta.env.VITE_COLOR_SCHEME_TOGGLE_ENABLED === true}/>
          </Group>
        </AppShell.Header>
        <Navbar selectedNavItemText={ props.pageName }/>
        <AppShell.Main>
          {box}
        </AppShell.Main>
      </AppShell>
  );
}

function getBox(isMobile: boolean, childElements: ReactNode, enableBoxClasses: boolean | undefined, cmt: number): ReactElement {
  let boxStyle = enableBoxClasses ? {backgroundColor:"light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))"} : undefined;
  if (isMobile) {
    return <Box style={boxStyle}>{childElements}</Box>
  } else {
    return <Box style={boxStyle} p="1em" mt={cmt + 'em'} ml='.5em' mr='.5em'>{childElements}</Box>
  }
}

export default BasicAppShell;
