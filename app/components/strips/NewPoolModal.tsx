import {
  Box,
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { poolTypes, type IStripPoolMember, type PoolType } from "~/api/pools/pools_api";
import type { ILedStrip, StripPlayState } from "~/api/strips/strips_api";
import StripPreviewBar from "./StripPreviewBar";

interface NewPoolModalProps {
  opened: boolean;
  onClose: () => void;
  strips: ILedStrip[];
  /** map of stripUuid → online (derived from client status) */
  onlineByStrip?: Record<string, boolean>;
  onCreate: (data: { name: string; poolType: PoolType; members: IStripPoolMember[] }) => void;
  isMobile?: boolean;
}

export function NewPoolModal({
  opened,
  onClose,
  strips,
  onlineByStrip = {},
  onCreate,
  isMobile = false,
}: NewPoolModalProps) {
  const [name, setName] = useState("New Pool");
  const [poolType, setPoolType] = useState<PoolType>("Sync");
  const [sel, setSel] = useState<string[]>([]);

  const reset = () => {
    setName("New Pool");
    setPoolType("Sync");
    setSel([]);
  };

  const onModalClose = () => {
    onClose();
    reset();
  };

  const toggle = (uuid: string) =>
    setSel((s) => (s.includes(uuid) ? s.filter((x) => x !== uuid) : [...s, uuid]));

  const eligible = strips.filter((s) => onlineByStrip[s.uuid] !== false);
  const valid = name.trim().length > 0 && sel.length >= 2;

  const submit = () => {
    if (!valid) return;
    const members: IStripPoolMember[] = sel.map((stripUuid, idx) => ({
      stripUuid,
      inverted: false,
      poolIndex: idx,
    }));
    onCreate({ name: name.trim(), poolType, members });
    onModalClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onModalClose}
      title="New Strip Pool"
      radius="md"
      size="md"
      fullScreen={isMobile}
      centered
    >
      <Stack gap="md">
        <TextInput
          data-testid="pool-name"
          label="Pool name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          size={isMobile ? "md" : "sm"}
          withAsterisk
        />
        <Select
          data-testid="pool-type"
          label="Pool type"
          value={poolType}
          onChange={(v) => v && setPoolType(v as PoolType)}
          data={poolTypes.map((t) => ({
            value: t,
            label: t === "Sync" ? "Sync — all strips play the same effect" : "Unified — strips treated as one strip",
          }))}
          size={isMobile ? "md" : "sm"}
        />
        <Box>
          <Text size="sm" fw={500} mb={6}>
            Select strips
          </Text>
          {eligible.length === 0 ? (
            <Text size="sm" c="dimmed">
              No online strips available. Bring a strip online to add it to a pool.
            </Text>
          ) : (
            <Stack gap={6}>
              {eligible.map((s) => {
                const checked = sel.includes(s.uuid);
                return (
                  <Box
                    key={s.uuid}
                    data-testid={`pool-strip-${s.uuid}`}
                    onClick={() => toggle(s.uuid)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 4,
                      cursor: "pointer",
                      border: `1px solid ${checked ? "var(--neon-accent)" : "var(--mantine-color-default-border)"}`,
                      background: checked ? "var(--neon-accent-dim)" : "var(--mantine-color-default)",
                      transition: "background .12s, border-color .12s",
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => {}}
                      tabIndex={-1}
                      styles={{ input: { cursor: "pointer" } }}
                    />
                    <Text size="sm" style={{ minWidth: 100 }}>{s.name}</Text>
                    <Box style={{ flex: 1 }}>
                      <StripPreviewBar
                        online={onlineByStrip[s.uuid] !== false}
                        playState={"stopped" as StripPlayState}
                        brightness={s.brightness}
                        effectType={null}
                        color={null}
                        size="small"
                      />
                    </Box>
                    <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
                      {s.length}L
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
        <Group justify="flex-end">
          <Button variant="default" onClick={onModalClose}>
            Cancel
          </Button>
          <Button data-testid="pool-create-btn" disabled={!valid} onClick={submit}>
            Create Pool
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default NewPoolModal;
