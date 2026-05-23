import { ActionIcon, Badge, Box, Group, Paper, Slider, Stack, Text } from "@mantine/core";
import { PauseIcon, PlayIcon, StopIcon } from "@phosphor-icons/react";
import type { ILightEffect } from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import type { ILedStrip, StripPlayState } from "~/api/strips/strips_api";
import StatusDot from "~/components/util/StatusDot";
import { stripStatusBadge } from "~/components/util/stripHelpers";
import StripPreviewBar from "~/components/strips/StripPreviewBar";

interface EffectsStripCardProps {
  strip: ILedStrip;
  online: boolean;
  playState: StripPlayState;
  activeEffect?: ILightEffect;
  activeEffectCount: number;
  palette?: IPalette;
  selected: boolean;
  onSelect: (uuid: string) => void;
  onUpdatePlayState: (cmd: "Play" | "Pause" | "Stop") => void;
  onUpdateBrightness: (brightness: number) => void;
}

export function StripCard({
  strip,
  online,
  playState,
  activeEffect,
  activeEffectCount,
  palette,
  selected,
  onSelect,
  onUpdatePlayState,
  onUpdateBrightness,
}: EffectsStripCardProps) {
  const { label, badgeColor } = stripStatusBadge(online, playState);
  const settings = (activeEffect?.settings ?? {}) as { color?: string; colorB?: string; speed?: number };

  // Footer summary: "EffectName · PaletteName" or "EffectName +N" (N counts active effects beyond the base) or em-dash
  const extra = Math.max(0, activeEffectCount - 1);
  const footer = !activeEffect
    ? "—"
    : extra > 0
      ? `${activeEffect.type} +${extra}`
      : palette
        ? `${activeEffect.type} · ${palette.name}`
        : activeEffect.type;

  return (
    <Paper
      withBorder
      radius="sm"
      p="xs"
      className="neon-slide-in"
      data-testid={`eff-strip-card-${strip.uuid}`}
      onClick={() => onSelect(strip.uuid)}
      style={{
        cursor: "pointer",
        borderColor: selected ? "var(--neon-accent)" : undefined,
        background: selected ? "var(--neon-bg3)" : undefined,
        boxShadow: selected ? "0 0 0 1px var(--neon-accent-glow)" : undefined,
        transition: "all .15s",
      }}
    >
      <Group gap={8} wrap="nowrap" align="center" mb={6} style={{ minWidth: 0 }}>
        <StatusDot online={online} playState={playState} />
        <Text size="xs" fw={500} style={{ minWidth: 0 }} truncate>
          {strip.name}
        </Text>
        <Badge
          size="xs"
          variant="light"
          color={badgeColor}
          ff="var(--mantine-font-family-monospace)"
          style={{ letterSpacing: "0.06em", flexShrink: 0 }}
        >
          {label}
        </Badge>
      </Group>
      <Box mb={6}>
        <StripPreviewBar
          online={online}
          playState={playState}
          brightness={strip.brightness}
          effectType={activeEffect?.type ?? null}
          color={settings.color ?? null}
          colorB={settings.colorB ?? null}
          speed={typeof settings.speed === "number" ? settings.speed : 50}
        />
      </Box>
      <Text
        ff="var(--mantine-font-family-monospace)"
        size="xs"
        c={activeEffect ? undefined : "var(--neon-text3)"}
        style={{ fontSize: 10 }}
        truncate
      >
        {footer}
      </Text>

      {selected && (
        <Stack
          gap={8}
          pt="xs"
          mt="xs"
          style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        >
          <Group gap={6}>
            <ActionIcon
              data-testid={`strip-play-${strip.uuid}`}
              variant={playState === "playing" ? "light" : "subtle"}
              size="sm"
              disabled={!online}
              onClick={(e) => { e.stopPropagation(); onUpdatePlayState("Play"); }}
              aria-label="Play"
            >
              <PlayIcon size={12} weight="fill" />
            </ActionIcon>
            <ActionIcon
              data-testid={`strip-pause-${strip.uuid}`}
              variant={playState === "paused" ? "light" : "subtle"}
              size="sm"
              disabled={!online || playState === "stopped"}
              onClick={(e) => { e.stopPropagation(); onUpdatePlayState("Pause"); }}
              aria-label="Pause"
            >
              <PauseIcon size={12} weight="fill" />
            </ActionIcon>
            <ActionIcon
              data-testid={`strip-stop-${strip.uuid}`}
              variant="subtle"
              size="sm"
              disabled={!online}
              onClick={(e) => { e.stopPropagation(); onUpdatePlayState("Stop"); }}
              aria-label="Stop"
            >
              <StopIcon size={12} weight="fill" />
            </ActionIcon>
          </Group>
          <Stack gap={4} onClick={(e) => e.stopPropagation()}>
            <Group justify="space-between">
              <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">Brightness</Text>
              <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">{strip.brightness}%</Text>
            </Group>
            <Slider
              data-testid={`strip-brightness-${strip.uuid}`}
              value={strip.brightness}
              min={0}
              max={100}
              size="xs"
              label={null}
              onChange={onUpdateBrightness}
            />
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}

export default StripCard;
