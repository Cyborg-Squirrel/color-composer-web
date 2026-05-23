import { ActionIcon, Badge, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { TrashIcon } from "@phosphor-icons/react";
import type { ILedStrip, StripPlayState } from "~/api/strips/strips_api";
import StatusDot from "~/components/util/StatusDot";
import { stripStatusBadge } from "~/components/util/stripHelpers";

interface StripListCardProps {
  strip: ILedStrip;
  online: boolean;
  playState: StripPlayState;
  clientName: string;
  isInPool: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function StripListCard({
  strip,
  online,
  playState,
  clientName,
  isInPool,
  onClick,
  onDelete,
}: StripListCardProps) {
  const badge = stripStatusBadge(online, playState);

  return (
    <Paper
      withBorder
      radius="sm"
      p="sm"
      className="neon-slide-in"
      data-testid={`strip-card-${strip.uuid}`}
      onClick={onClick}
      style={{ cursor: "pointer", transition: "border-color .15s" }}
    >
      <Stack gap={8}>
        <Group gap={10} wrap="nowrap" align="center">
          <StatusDot online={online} playState={playState} />
          <Text size="sm" fw={500} truncate>
            {strip.name}
          </Text>
          <Badge
            size="xs"
            variant="default"
            color={badge.badgeColor}
            ff="var(--mantine-font-family-monospace)"
            style={{ letterSpacing: "0.06em" }}
          >
            {badge.label}
          </Badge>
          <div style={{ flex: 1, minWidth: 0 }}></div>
          <Tooltip
            label={isInPool ? "Remove from pool first" : "Delete strip"}
            openDelay={300}
          >
            <ActionIcon
              data-testid={`strip-delete-${strip.uuid}`}
              variant="subtle"
              color="red"
              size="sm"
              disabled={isInPool}
              onClick={(e) => {
                e.stopPropagation();
                if (!isInPool) onDelete();
              }}
              aria-label="Delete strip"
            >
              <TrashIcon size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group gap="md" wrap="wrap">
          <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
            {strip.length} LEDs · {clientName}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}

export default StripListCard;
