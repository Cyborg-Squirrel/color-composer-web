import { ActionIcon, AppShell, Box, Burger, Code, Container, Divider, Group, Modal, Space, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { InfoIcon } from '@phosphor-icons/react';
import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
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

function AboutModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const rows = [
    { label: 'Version', value: 'v0.0.1' },
    { label: 'API', value: 'Kotlin · Micronaut · Postgres' },
    { label: 'Web', value: 'React · Mantine v9 · Tailwind' },
  ];
  return (
    <Modal opened={opened} onClose={onClose} title="About Color Composer" radius="md" size="md">
      <Text size="sm" mb="sm">
        Color Composer is a light effect controller for WS2812/NeoPixel LED strips.
      </Text>
      <Text size="sm" mb="md">
        It supports multiple clients (Pi and NightDriver), layered effects, custom palettes, and time-based triggers.
      </Text>
      {rows.map(r => (
        <Group key={r.label} gap="sm" mb={4}>
          <Text size="sm" fw={600} c="dimmed" w={60}>{r.label}</Text>
          <Text size="sm">{r.value}</Text>
        </Group>
      ))}
    </Modal>
  );
}

export default function BasicAppShell(props: IAppShellProps) {
  const isMobile = isMobileUi();
  const [opened, { toggle }] = useDisclosure();
  const [aboutOpened, setAboutOpened] = useState(false);
  let titlePadding = isMobile ? '.33em' : undefined;
  let boxCssEnabled = props.boxCssEnabled ?? true;
  const ref = useRef<HTMLElement>(null);

  let box = getBox((props.children), boxCssEnabled, ref);

  return (
    <AppShellRefContext.Provider value={ref}>
      <AboutModal opened={aboutOpened} onClose={() => setAboutOpened(false)} />
      <AppShell
        padding="md"
        header={{ height: { base: 60, md: 65, lg: 70 } }}
        navbar={{
          width: { base: 200, md: 250, lg: 300 },
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}>
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Text id="title" fw={700} span>{props.title}</Text>
              </Link>
              <Code id="version" fw={700}>v0.0.1</Code>
            </Group>
            <Group gap="md">
              <ColorSchemeToggle hidden={import.meta.env.VITE_COLOR_SCHEME_TOGGLE_ENABLED !== 'true'} />
              <ActionIcon variant="transparent" size="lg" onClick={() => setAboutOpened(true)} aria-label="About">
                <InfoIcon size={16} />
              </ActionIcon>
            </Group>
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
