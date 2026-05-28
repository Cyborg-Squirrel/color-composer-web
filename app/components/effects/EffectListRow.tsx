import { ActionIcon, Badge, Box, Group, Menu, Stack, Text, UnstyledButton } from "@mantine/core";
import { DotsThreeVerticalIcon, LightningIcon, LightningSlashIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import type { ILightEffectSettings } from "~/api/effect_settings/effect_settings_api";
import { LightEffectStatus, type ILightEffect } from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import { previewBackground } from "~/constants/effects";

interface EffectListRowProps {
  effect: ILightEffect;
  /** Linked settings preset, looked up via effect.settingsUuid. */
  settings?: ILightEffectSettings;
  palette?: IPalette;
  onEdit: () => void;
  onDelete: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

function buildSummary(effect: ILightEffect, settings: ILightEffectSettings | undefined, palette?: IPalette): string {
  const parts: string[] = [effect.type];
  const s = settings?.settings ?? {};
  if (typeof s.color === "string") parts.push((s.color as string).toUpperCase());
  if (palette) parts.push(palette.name);
  return parts.join(" · ");
}

export function EffectListRow({
  effect,
  settings,
  palette,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}: EffectListRowProps) {
  const color = "#4488ff";
  const bg = previewBackground(effect.type, color);
  const isGradient = bg.startsWith("linear-gradient");
  const isInactive = effect.status === LightEffectStatus.Inactive;
  const isBase = !isInactive && effect.layer === 0;
  const isPlaying = effect.status === LightEffectStatus.Playing;
  const layerLabel = !isInactive
    ? (effect.layer === 0 ? "Base" : `Layer ${effect.layer}`)
    : null;
  const summary = buildSummary(effect, settings, palette);
  const [hoverActivate, setHoverActivate] = useState(false);

  const swatchBackground = isGradient
    ? bg
    : `radial-gradient(circle at 30% 30%, ${color}cc, ${color}55)`;

  return (
    <Box
      data-testid={`eff-row-${effect.uuid}`}
      style={{
        background: "var(--neon-bg2)",
        border: "1px solid var(--mantine-color-default-border)",
        borderRadius: 4,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
      className="neon-slide-in"
    >
      {isInactive ? (
        <UnstyledButton
          data-testid={`eff-row-activate-${effect.uuid}`}
          onClick={onActivate}
          aria-label="Activate effect"
          onMouseEnter={() => setHoverActivate(true)}
          onMouseLeave={() => setHoverActivate(false)}
          onFocus={() => setHoverActivate(true)}
          onBlur={() => setHoverActivate(false)}
          style={{
            position: "relative",
            width: 34,
            height: 34,
            borderRadius: 3,
            flexShrink: 0,
            background: swatchBackground,
            border: "1px solid var(--mantine-color-default-border)",
            overflow: "hidden",
          }}
        >
          {hoverActivate && (
            <Box
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.55)",
                color: "var(--neon-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 8px var(--neon-accent-glow)",
              }}
            >
              <PlusIcon size={18} weight="bold" />
            </Box>
          )}
        </UnstyledButton>
      ) : (
        <Box
          style={{
            width: 34,
            height: 34,
            borderRadius: 3,
            flexShrink: 0,
            background: swatchBackground,
            border: "1px solid var(--mantine-color-default-border)",
            boxShadow: isPlaying ? "0 0 8px var(--neon-accent-glow)" : "none",
          }}
        />
      )}

      <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
        <Group gap={8} wrap="nowrap" align="center">
          <Text size="sm" fw={500} truncate style={{ maxWidth: "100%" }}>
            {effect.name}
          </Text>
          {effect.category && (
            <Badge
              size="xs"
              radius="sm"
              variant="default"
              styles={{
                root: {
                  textTransform: "uppercase",
                  fontFamily: "var(--mantine-font-family-monospace)",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                },
              }}
            >
              {effect.category}
            </Badge>
          )}
        </Group>
        <Text
          ff="var(--mantine-font-family-monospace)"
          size="xs"
          c="dimmed"
          truncate
          style={{ letterSpacing: "0.04em" }}
        >
          {summary}
        </Text>
      </Stack>

      {layerLabel && (
        <Text
          ff="var(--mantine-font-family-monospace)"
          size="xs"
          tt="uppercase"
          style={{
            color: isBase ? "var(--neon-accent)" : "var(--neon-text3)",
            letterSpacing: "0.06em",
            width: 70,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {layerLabel}
        </Text>
      )}

      <Menu
        position="bottom-end"
        shadow="md"
        width={150}
        withinPortal
        trigger="click"
      >
        <Menu.Target>
          <ActionIcon
            data-testid={`eff-row-menu-${effect.uuid}`}
            variant="subtle"
            size="sm"
            aria-label="Effect actions"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsThreeVerticalIcon size={16} weight="bold" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            data-testid={`eff-row-edit-${effect.uuid}`}
            leftSection={<PencilSimpleIcon size={12} />}
            onClick={onEdit}
          >
            Edit
          </Menu.Item>
          {!isInactive && onDeactivate && (
            <Menu.Item
              data-testid={`eff-row-deactivate-${effect.uuid}`}
              leftSection={<LightningSlashIcon size={12} />}
              onClick={onDeactivate}
            >
              Deactivate
            </Menu.Item>
          )}
          {isInactive && onActivate && (
            <Menu.Item
              data-testid={`eff-row-menu-activate-${effect.uuid}`}
              leftSection={<LightningIcon size={12} />}
              onClick={onActivate}
            >
              Activate
            </Menu.Item>
          )}
          <Menu.Item
            data-testid={`eff-row-delete-${effect.uuid}`}
            leftSection={<TrashIcon color="var(--mantine-color-red-7)" size={12} />}
            onClick={onDelete}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}

export default EffectListRow;
