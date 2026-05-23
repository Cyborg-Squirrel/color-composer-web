import { Box, Button, Group, Modal, Select, Stack, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { findSchema, type ILightEffect } from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import { previewBackground } from "~/constants/effects";
import { useEffectSchemas } from "~/provider/EffectApiContext";
import EffectParams from "./EffectParams";

export interface EditEffectPayload {
  name: string;
  settings: Record<string, unknown>;
  paletteUuid: string | null;
}

interface EditEffectModalProps {
  effect: ILightEffect | null;
  palettes: IPalette[];
  isMobile?: boolean;
  onClose: () => void;
  onSave: (payload: EditEffectPayload) => void;
}

export function EditEffectModal({
  effect,
  palettes,
  isMobile = false,
  onClose,
  onSave,
}: EditEffectModalProps) {
  const { schemas } = useEffectSchemas();
  const [name, setName] = useState("");
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [paletteUuid, setPaletteUuid] = useState<string | null>(null);

  useEffect(() => {
    if (effect) {
      setName(effect.name);
      setSettings(effect.settings ?? {});
      setPaletteUuid(effect.paletteUuid ?? null);
    }
  }, [effect?.uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!effect) return null;
  const schema = findSchema(schemas, effect.type);
  const color = (settings.color as string | undefined) ?? "#4488ff";
  const bg = previewBackground(effect.type, color);
  const isGradient = bg.startsWith("linear-gradient");

  const valid = Boolean(name.trim());

  return (
    <Modal
      opened={Boolean(effect)}
      onClose={onClose}
      title={<div style={{ fontWeight: 600 }}>Edit {effect.type}</div>}
      radius="md"
      size="sm"
      fullScreen={isMobile}
      centered
    >
      <Stack gap="md">
        <Group
          gap="sm"
          wrap="nowrap"
          p="xs"
          style={{
            border: "1px solid var(--mantine-color-default-border)",
            borderRadius: 3,
            background: "var(--neon-bg)",
          }}
        >
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 3,
              flexShrink: 0,
              background: isGradient
                ? bg
                : `radial-gradient(circle at 30% 30%, ${color}cc, ${color}55)`,
              border: "1px solid var(--mantine-color-default-border)",
            }}
          />
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {effect.type}
            </Text>
            <Text
              ff="var(--mantine-font-family-monospace)"
              size="xs"
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: "0.06em" }}
            >
              {schema?.category ?? effect.category ?? ""}
            </Text>
          </Stack>
        </Group>

        <TextInput
          data-testid="edit-effect-name"
          label="Effect name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          size={isMobile ? "md" : "sm"}
        />

        {schema ? (
          <EffectParams
            fields={schema.fields}
            value={settings}
            onChange={setSettings}
            compact
          />
        ) : (
          <Text size="xs" c="dimmed" fs="italic">
            No schema available for {effect.type}.
          </Text>
        )}

        <Select
          data-testid="edit-effect-palette"
          label="Palette (optional)"
          placeholder="None"
          clearable
          value={paletteUuid}
          onChange={setPaletteUuid}
          data={palettes.map((p) => ({ value: p.uuid, label: p.name }))}
          size={isMobile ? "md" : "sm"}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} data-testid="edit-effect-cancel">
            Cancel
          </Button>
          <Button
            data-testid="edit-effect-save"
            disabled={!valid}
            onClick={() => onSave({ name: name.trim(), settings, paletteUuid })}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default EditEffectModal;
