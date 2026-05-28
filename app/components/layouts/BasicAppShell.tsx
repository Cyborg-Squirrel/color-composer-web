import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Container,
  Divider,
  Group,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { InfoIcon, LightbulbIcon } from "@phosphor-icons/react";
import { useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { isMobileUi } from "~/components/util/IsMobile";
import { AppShellRefContext } from "~/provider/AppShellContext";
import { ColorSchemeToggle } from "../controls/ColorSchemeToggle";
import { PrimaryColorPicker } from "../controls/PrimaryColorPicker";
import styles from "./BasicAppShell.module.css";
import NavDrawer from "./NavDrawer";

type ContainerSize = "xs" | "sm" | "md" | "lg" | "xl" | number | undefined;
type Padding = "xl" | "lg" | "md" | "sm" | "xs";

interface IAppShellProps {
  title: string;
  pageName: string;
  addButton?: ReactNode;
  searchBar?: ReactNode;
  children?: ReactNode;
  topPadding?: Padding;
  hideDivider?: boolean;
  boxCssEnabled?: boolean;
  /** Skip in-page header and container — used by full-height pages like Effects. */
  fullHeight?: boolean;
  /** Container max-width override (per design: Home/Palettes "md", Clients/Strips "xl"). */
  containerSize?: ContainerSize;
}

function AboutModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const rows = [
    { label: "Version", value: import.meta.env.VITE_APP_VERSION },
    { label: "API", value: "Kotlin · Micronaut · Postgres" },
    { label: "Web", value: "React · Mantine v9 · Tailwind" },
  ];
  return (
    <Modal opened={opened} onClose={onClose} title="About Color Composer" radius="md" size="md">
      <Text size="sm" mb="sm">
        Color Composer is a light effect controller for WS2812/NeoPixel LED strips.
      </Text>
      <Text size="sm" mb="md">
        It supports multiple clients (Pi and NightDriver), layered effects, custom palettes, and time-based triggers.
      </Text>
      {rows.map((r) => (
        <Group key={r.label} gap="sm" mb={4}>
          <Text size="sm" fw={600} c="dimmed" w={60}>
            {r.label}
          </Text>
          <Text size="sm">{r.value}</Text>
        </Group>
      ))}
    </Modal>
  );
}

export default function BasicAppShell(props: IAppShellProps) {
  const isMobile = isMobileUi();
  const { pathname } = useLocation();
  const [drawerOpen, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [aboutOpened, setAboutOpened] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <AppShellRefContext.Provider value={ref}>
      <AboutModal opened={aboutOpened} onClose={() => setAboutOpened(false)} />
      <NavDrawer open={drawerOpen} onClose={closeDrawer} />
      <AppShell
        padding={props.fullHeight ? 0 : "md"}
        header={{ height: { base: 52, md: 56, lg: 60 } }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Burger
                opened={drawerOpen}
                onClick={openDrawer}
                size="sm"
                aria-label="Open navigation"
                data-testid="app-burger"
              />
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Group gap={6} wrap="nowrap">
                  <LightbulbIcon size={16} weight="fill" style={{ color: "var(--neon-accent)" }} />
                  <Text
                    id="title"
                    ff="var(--mantine-font-family-monospace)"
                    fw={600}
                    size="sm"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {props.title}
                  </Text>
                </Group>
              </Link>
            </Group>
            <Group gap="sm" wrap="nowrap">
              <ColorSchemeToggle hidden={import.meta.env.VITE_COLOR_SCHEME_TOGGLE_ENABLED !== "true"} />
              <PrimaryColorPicker />
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                onClick={() => setAboutOpened(true)}
                aria-label="About"
              >
                <InfoIcon size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main style={props.fullHeight ? { height: "100%", display: "flex", flexDirection: "column" } : undefined}>
          {props.fullHeight ? (
            <Box ref={ref} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
              {props.children}
            </Box>
          ) : (
            <PageContainer isMobile={isMobile} size={props.containerSize ?? "md"}>
              <Group justify="space-between" wrap="nowrap">
                <Title pl={isMobile ? ".33em" : undefined} pt={isMobile ? ".33em" : undefined} order={2}>
                  {props.pageName}
                </Title>
                {!isMobile && props.searchBar}
                {props.addButton}
              </Group>
              {!props.hideDivider && <Divider mt="xs" />}
              {props.topPadding && <Box h={`var(--mantine-spacing-${props.topPadding})`} />}
              {isMobile && props.searchBar && (
                <Group justify="center" pt="sm">{props.searchBar}</Group>
              )}
              <Box
                ref={ref}
                mt="md"
                className={props.boxCssEnabled !== false ? styles.box : undefined}
              >
                {props.children}
              </Box>
            </PageContainer>
          )}
        </AppShell.Main>
      </AppShell>
    </AppShellRefContext.Provider>
  );
}

function PageContainer({ children, isMobile, size }: { children: ReactNode; isMobile: boolean; size: ContainerSize }) {
  if (isMobile) return <>{children}</>;
  return (
    <Container size={size} mt="md">
      {children}
    </Container>
  );
}
