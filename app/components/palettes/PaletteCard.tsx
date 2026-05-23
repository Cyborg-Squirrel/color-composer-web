import { ActionIcon, Box, Group, Paper, Text } from "@mantine/core";
import { TrashIcon } from "@phosphor-icons/react";
import type { IPalette } from "~/api/palettes/palettes_api";

interface PaletteCardProps {
  palette: IPalette;
  onClick: () => void;
  onDelete: () => void;
}

export function PaletteCard({ palette, onClick, onDelete }: PaletteCardProps) {
  const colors = (palette.settings?.colors as string[] | undefined) ?? [];

  return (
    <Paper
      withBorder
      radius="sm"
      p="md"
      className="neon-slide-in"
      data-testid={`palette-card-${palette.uuid}`}
      onClick={onClick}
      style={{ cursor: "pointer", transition: "border-color .15s" }}
    >
      <Group justify="space-between" mb={10} wrap="nowrap">
        <Text size="sm" fw={500} truncate style={{ flex: 1, minWidth: 0 }}>
          {palette.name}
        </Text>
        <ActionIcon
          data-testid={`palette-delete-${palette.uuid}`}
          variant="subtle"
          color="red"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          aria-label="Delete palette"
        >
          <TrashIcon size={14} />
        </ActionIcon>
      </Group>
      {colors.length > 0 ? (
        <>
          <Box style={{ display: "flex", height: 28, borderRadius: 3, overflow: "hidden", gap: 1 }}>
            {colors.map((c, i) => (
              <Box key={i} style={{ flex: 1, background: c }} />
            ))}
          </Box>
          <Group gap={6} mt={8} wrap="wrap">
            {colors.map((c, i) => (
              <Text key={i} ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
                {c.toUpperCase()}
              </Text>
            ))}
          </Group>
        </>
      ) : (
        <Text size="xs" c="dimmed" fs="italic">No colors</Text>
      )}
      <Text mt={6} ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed" style={{ letterSpacing: "0.04em" }}>
        {palette.type}
      </Text>
    </Paper>
  );
}

export default PaletteCard;
