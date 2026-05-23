import { ActionIcon, Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { PauseIcon, PlayIcon, StackIcon, StopIcon } from "@phosphor-icons/react";
import type { IStripPool } from "~/api/pools/pools_api";
import type { ILedStrip, StripPlayState } from "~/api/strips/strips_api";
import StripPreviewBar from "./StripPreviewBar";

interface PoolCardProps {
  pool: IStripPool;
  strips: ILedStrip[];
  playState: StripPlayState;
  /** map of stripUuid → online */
  onlineByStrip: Record<string, boolean>;
  selected?: boolean;
  variant: "effects" | "strips";
  onSelect?: (uuid: string) => void;
  onUpdatePlayState?: (command: "Play" | "Pause" | "Stop") => void;
  /** Active effect type name (for preview animation). */
  activeEffectType?: string | null;
  activeColor?: string | null;
}

export function PoolCard({
  pool,
  strips,
  playState,
  onlineByStrip,
  selected = false,
  variant,
  onSelect,
  onUpdatePlayState,
  activeEffectType,
  activeColor,
}: PoolCardProps) {
  const members = pool.members
    .slice()
    .sort((a, b) => a.poolIndex - b.poolIndex)
    .map((m) => strips.find((s) => s.uuid === m.stripUuid))
    .filter((s): s is ILedStrip => Boolean(s));

  const isEffectsVariant = variant === "effects";

  return (
    <Paper
      withBorder
      radius="sm"
      p="xs"
      className="neon-slide-in"
      onClick={isEffectsVariant && onSelect ? () => onSelect(pool.uuid) : undefined}
      style={{
        cursor: isEffectsVariant && onSelect ? "pointer" : "default",
        borderColor: selected ? "var(--neon-purple)" : undefined,
        background: selected ? "var(--neon-bg3)" : undefined,
        transition: "border-color .15s, background .15s",
      }}
    >
      <Group gap="xs" wrap="nowrap" mb={members.length ? 6 : 0}>
        <StackIcon size={14} weight="duotone" style={{ color: "var(--neon-purple)", flexShrink: 0 }} />
        <Text size="sm" fw={500} style={{ flex: 1, minWidth: 0 }} truncate>
          {pool.name}
        </Text>
        <Badge
          color="violet"
          variant="light"
          size="xs"
          ff="var(--mantine-font-family-monospace)"
          style={{ letterSpacing: "0.08em" }}
        >
          {pool.poolType}
        </Badge>
        {!isEffectsVariant && playState === "playing" && (
          <Badge color="teal" variant="light" size="xs">Playing</Badge>
        )}
      </Group>

      {members.length > 0 && (
        <Stack gap={4}>
          {members.map((s) => (
            <Group key={s.uuid} gap={8} wrap="nowrap">
              <Text
                ff="var(--mantine-font-family-monospace)"
                size="xs"
                c="dimmed"
                style={{ width: 72, flexShrink: 0 }}
                truncate
              >
                {s.name}
              </Text>
              <Box style={{ flex: 1 }}>
                <StripPreviewBar
                  online={onlineByStrip[s.uuid] !== false}
                  playState={playState}
                  brightness={s.brightness}
                  effectType={activeEffectType}
                  color={activeColor}
                  size="small"
                />
              </Box>
            </Group>
          ))}
        </Stack>
      )}

      {isEffectsVariant && selected && onUpdatePlayState && (
        <Group gap={6} pt="xs" mt="xs" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
          <ActionIcon
            data-testid={`pool-play-${pool.uuid}`}
            variant={playState === "playing" ? "light" : "subtle"}
            color="violet"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onUpdatePlayState("Play"); }}
            aria-label="Play pool"
          >
            <PlayIcon size={12} weight="fill" />
          </ActionIcon>
          <ActionIcon
            data-testid={`pool-pause-${pool.uuid}`}
            variant={playState === "paused" ? "light" : "subtle"}
            color="violet"
            size="sm"
            disabled={playState === "stopped"}
            onClick={(e) => { e.stopPropagation(); onUpdatePlayState("Pause"); }}
            aria-label="Pause pool"
          >
            <PauseIcon size={12} weight="fill" />
          </ActionIcon>
          <ActionIcon
            data-testid={`pool-stop-${pool.uuid}`}
            variant="subtle"
            color="violet"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onUpdatePlayState("Stop"); }}
            aria-label="Stop pool"
          >
            <StopIcon size={12} weight="fill" />
          </ActionIcon>
        </Group>
      )}
    </Paper>
  );
}

export default PoolCard;
