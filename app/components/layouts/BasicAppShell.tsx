import { AppShell, Box, Burger, Code, Container, Divider, Group, Space, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRef, type ReactNode } from 'react';
import { isMobileUi } from '~/components/util/IsMobile';
import { AppShellRefContext } from '~/provider/AppShellContext';
import { ColorSchemeToggle } from '../controls/ColorSchemeToggle';
import styles from './BasicAppShell.module.css';
import Navbar from './Navbar';

interface IAppShellProps {
  title: string;
  pageName: string;
  addButton?: ReactNode,
  children?: ReactNode;
  topPadding: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  hideDivider?: boolean;
  boxCssEnabled?: boolean;
}

export default function BasicAppShell(props: IAppShellProps) {
  const isMobile = isMobileUi();
  const [opened, { toggle }] = useDisclosure();
  let titlePadding = isMobile ? '.33em' : undefined;
  let boxCssEnabled = props.boxCssEnabled ?? true;
  const ref = useRef<HTMLElement>(null);

  let box = getBox((props.children), boxCssEnabled, ref);

  return (
    <AppShellRefContext.Provider value={ref}>
      <AppShell
        padding="md"
        header={{ height: { base: 60, md: 65, lg: 70 } }}
        navbar={{
          width: { base: 200, md: 250, lg: 300 },
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}>
        <AppShell.Header>
          <Group h="100%" pl="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group justify="space-between">
              <Text id="title" fw={700} span>{props.title}</Text>
              <Code id="version" fw={700}>v0.0.1</Code>
            </Group>
            <ColorSchemeToggle hidden={import.meta.env.VITE_COLOR_SCHEME_TOGGLE_ENABLED !== 'true'} />
          </Group>
        </AppShell.Header>
        <Navbar />
        <AppShell.Main>
          <Containerize isMobile={isMobile}>
            <Group justify='space-between'>
              <Title pl={titlePadding} pt={titlePadding} order={2}>{props.pageName}</Title>
              {props.addButton}
            </Group>
            <Space h="xs"></Space>
            <Divider hidden={props.hideDivider}></Divider>
            <Space h={props.topPadding}></Space>
            {box}
          </Containerize>
        </AppShell.Main>
      </AppShell>
    </AppShellRefContext.Provider>
  );
}

function Containerize({ children, isMobile }: { children: ReactNode; isMobile: boolean }) {
  return isMobile ? children : <Container mt="2em">{children}</Container>;
}

function getBox(childElements: ReactNode, enableBoxClasses: boolean | undefined, ref: React.RefObject<HTMLElement>) {
  const boxClass = enableBoxClasses ? styles.box : ''; 
  return <Box className={boxClass} mt={'1.5em'} ref={ref}>{childElements}</Box>
}
