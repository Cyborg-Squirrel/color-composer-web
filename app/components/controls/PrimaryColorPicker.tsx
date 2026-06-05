import { ActionIcon, ColorPicker, Popover, Stack, Button, Group, Text } from "@mantine/core";
import { PaletteIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "color-composer-primary-color";

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyPrimaryColor(hex: string) {
  const root = document.documentElement;
  root.style.setProperty("--neon-accent", hex);
  root.style.setProperty("--neon-accent-dim", hexToRgba(hex, 0.15));
  root.style.setProperty("--neon-accent-glow", hexToRgba(hex, 0.3));
}

function clearPrimaryColor() {
  const root = document.documentElement;
  root.style.removeProperty("--neon-accent");
  root.style.removeProperty("--neon-accent-dim");
  root.style.removeProperty("--neon-accent-glow");
}

export function PrimaryColorPicker() {
  const [color, setColor] = useState<string>("#3bd672");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setColor(stored);
      applyPrimaryColor(stored);
    }
  }, []);

  const handleChange = (next: string) => {
    setColor(next);
    applyPrimaryColor(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    clearPrimaryColor();
    setColor("#3bd672");
  };

  return (
    <Popover position="bottom-end" withArrow shadow="md" radius="md">
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          aria-label="Change primary color"
        >
          <PaletteIcon size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Change primary color
          </Text>
          <ColorPicker
            value={color}
            onChange={handleChange}
            format="hex"
            swatches={[
              "#3bd672", "#5b8def", "#9c5bf0", "#d63b91",
              "#e0524a", "#e07b4a", "#f0c63b", "#3bb8d6",
            ]}
          />
          <Group justify="flex-end">
            <Button size="xs" variant="subtle" onClick={handleReset}>
              Reset
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
