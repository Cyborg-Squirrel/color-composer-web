import { ActionIcon, Box, Code, Drawer, Group, NavLink, Stack, Text } from "@mantine/core";
import {
  HouseIcon,
  LightbulbIcon,
  PaletteIcon,
  SparkleIcon,
  TimerIcon,
  WifiHighIcon,
  XIcon
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

export interface NavItem {
  link: string;
  label: string;
  icon: ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { link: "/",         label: "Home",     icon: <HouseIcon size={16} weight="duotone" /> },
  { link: "/clients",  label: "Clients",  icon: <WifiHighIcon size={16} weight="duotone" /> },
  { link: "/strips",   label: "Strips",   icon: <LightbulbIcon size={16} weight="duotone" /> },
  { link: "/effects",  label: "Effects",  icon: <SparkleIcon size={16} weight="duotone" /> },
  { link: "/palettes", label: "Palettes", icon: <PaletteIcon size={16} weight="duotone" /> },
  { link: "/triggers", label: "Triggers", icon: <TimerIcon size={16} weight="duotone" /> },
];

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const { pathname } = useLocation();

  return (
    <Drawer
      opened={open}
      onClose={onClose}
      position="left"
      size={240}
      padding={0}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.4, blur: 1 }}
      styles={{
        content: {
          background: "var(--neon-bg2)",
          borderRight: "1px solid var(--mantine-color-default-border)",
        },
      }}
    >
      <Stack gap={0} h="100%">
        <Group
          h={48}
          px="md"
          gap="xs"
          wrap="nowrap"
          style={{ borderBottom: "1px solid var(--mantine-color-default-border)", flexShrink: 0, cursor: "pointer" }}
        >
          <Text ff="var(--mantine-font-family-monospace)" fw={600} size="sm" style={{ letterSpacing: "-0.02em" }}>
            Color Composer
          </Text>
          <Code style={{ fontSize: 9, padding: "1px 5px" }}>{import.meta.env.VITE_APP_VERSION}</Code>
          <ActionIcon ml="auto" variant="subtle" color="gray" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close menu">
            <XIcon size={16} />
          </ActionIcon>
        </Group>

        <Box style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.link}
              component={Link}
              to={item.link}
              label={item.label}
              leftSection={item.icon}
              active={pathname === item.link || (item.link !== "/" && pathname.startsWith(item.link))}
              onClick={onClose}
              data-testid={`nav-${item.label.toLowerCase()}`}
              styles={{
                root: {
                  borderLeft: pathname === item.link ? "2px solid var(--neon-accent)" : "2px solid transparent",
                  fontWeight: pathname === item.link ? 500 : 400,
                },
              }}
            />
          ))}
        </Box>
      </Stack>
    </Drawer>
  );
}

export default NavDrawer;
