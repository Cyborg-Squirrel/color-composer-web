import { Box, Group, Text, UnstyledButton } from "@mantine/core";
import { CaretRightIcon } from "@phosphor-icons/react";
import type { IEffectSchema } from "~/api/effects/effects_api";
import { previewBackground } from "~/constants/effects";

interface EffectCardProps {
  schema: IEffectSchema;
  active: boolean;
  onSelect: () => void;
}

export function EffectCard({ schema, active, onSelect }: EffectCardProps) {
  const bg = previewBackground(schema.effectName, "#4488ff");

  return (
    <UnstyledButton
      onClick={onSelect}
      data-testid={`effect-card-${schema.effectName}`}
      className="neon-slide-in"
      style={{
        background: active ? "var(--neon-accent-dim)" : "var(--mantine-color-default)",
        border: `1px solid ${active ? "var(--neon-accent)" : "var(--mantine-color-default-border)"}`,
        borderRadius: 4,
        padding: "8px 10px",
        width: "100%",
        transition: "all .15s",
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <Box
          style={{
            width: 28,
            height: 28,
            borderRadius: 3,
            flexShrink: 0,
            background: bg,
            boxShadow: active ? "0 0 8px var(--neon-accent-glow)" : "none",
          }}
        />
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" fw={500} c={active ? "var(--neon-accent)" : undefined} truncate>
            {schema.effectName}
          </Text>
          <Text
            ff="var(--mantine-font-family-monospace)"
            size="xs"
            c="dimmed"
            tt="uppercase"
            style={{ fontSize: 9, letterSpacing: "0.08em" }}
          >
            {schema.category}
          </Text>
        </Box>
        {active && <CaretRightIcon size={12} weight="bold" style={{ color: "var(--neon-accent)" }} />}
      </Group>
    </UnstyledButton>
  );
}

export default EffectCard;
