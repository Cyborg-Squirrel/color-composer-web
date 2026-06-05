import { ActionIcon, Badge, Box, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { CpuIcon, TrashIcon } from "@phosphor-icons/react";
import { ClientStatus, NightDriverType, PiClientType, type ILedStripClient } from "~/api/clients/clients_api";

interface ClientCardProps {
  client: ILedStripClient;
  stripCount: number;
  onClick: () => void;
  onDelete: () => void;
}

export function ClientCard({ client, stripCount, onClick, onDelete }: ClientCardProps) {
  const online = client.status !== ClientStatus.Offline && client.status !== ClientStatus.Error;
  const isPi = client.clientType === PiClientType;
  const typeLabel = isPi ? "Pi" : client.clientType === NightDriverType ? "Night Driver" : client.clientType;
  const deleteDisabled = stripCount > 0;

  return (
    <Paper
      withBorder
      radius="sm"
      p="md"
      className="neon-slide-in"
      data-testid={`client-card-${client.uuid}`}
      onClick={onClick}
      style={{ cursor: "pointer", transition: "border-color .15s" }}
    >
      <Group gap="md" wrap="nowrap" align="center">
        <Box
          style={{
            width: 36,
            height: 36,
            borderRadius: 4,
            background: "var(--neon-bg4)",
            border: "1px solid var(--mantine-color-default-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CpuIcon
            size={18}
            weight="duotone"
            style={{ color: online ? "var(--neon-accent)" : "var(--neon-text3)" }}
          />
        </Box>

        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs" wrap="wrap" align="center">
            <Text size="sm" fw={500} truncate>
              {client.name}
            </Text>
            <Badge
              size="xs"
              variant="light"
              color={isPi ? "violet" : "blue"}
              ff="var(--mantine-font-family-monospace)"
              style={{ letterSpacing: "0.06em" }}
            >
              {typeLabel}
            </Badge>
            <Badge
              size="xs"
              variant="light"
              color={online ? "teal" : "gray"}
              ff="var(--mantine-font-family-monospace)"
              style={{ letterSpacing: "0.06em" }}
            >
              {online ? "Online" : "Offline"}
            </Badge>
          </Group>
          <Group gap="md" wrap="wrap">
            <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
              {client.address}
            </Text>
            <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
              {stripCount} {stripCount === 1 ? "strip" : "strips"}
            </Text>
          </Group>
        </Stack>

        <Tooltip
          label={deleteDisabled ? "Remove attached strips first" : "Delete client"}
          openDelay={300}
        >
          <ActionIcon
            data-testid={`client-delete-${client.uuid}`}
            variant="subtle"
            color="red"
            size="sm"
            disabled={deleteDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!deleteDisabled) onDelete();
            }}
            aria-label="Delete client"
          >
            <TrashIcon size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}

export default ClientCard;
