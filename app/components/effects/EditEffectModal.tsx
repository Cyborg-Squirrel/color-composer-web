import { Box, Button, Group, Modal, Select, Stack, Text, TextInput } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import type {
  ILightEffectSettings,
  ILightEffectSettingsMutation,
} from "~/api/effect_settings/effect_settings_api";
import { findSchema, validateSettings, type ILightEffect } from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import { previewBackground } from "~/constants/effects";
import { useEffectSchemas } from "~/provider/EffectApiContext";
import EffectParams from "./EffectParams";

export interface EditEffectPayload {
  effect: {
    name: string;
    paletteUuid: string | null;
    settingsUuid: string | null;
  };
  /** Present when the user edited the linked preset's name or settings. */
  preset?: {
    uuid: string;
    mutation: Partial<ILightEffectSettingsMutation>;
  };
}

interface EditEffectModalProps {
  effect: ILightEffect;
  palettes: IPalette[];
  presets: ILightEffectSettings[];
  isMobile?: boolean;
  onClose: () => void;
  onSave: (payload: EditEffectPayload) => void;
}

export function EditEffectModal({
  effect,
  palettes,
  presets,
  isMobile = false,
  onClose,
  onSave,
}: EditEffectModalProps) {
  const { schemas } = useEffectSchemas();
  const schema = findSchema(schemas, effect.type);

  const presetsForType = useMemo(
    () => presets.filter((p) => p.type === effect.type),
    [presets, effect.type],
  );

  const [name, setName] = useState(effect.name);
  const [paletteUuid, setPaletteUuid] = useState<string | null>(effect.paletteUuid ?? null);
  const [linkedUuid, setLinkedUuid] = useState<string | null>(effect.settingsUuid ?? null);
  const [presetName, setPresetName] = useState<string>("");
  const [settings, setSettings] = useState<Record<string, unknown>>({});

  // Hydrate effect-level fields when the modal opens for a new effect.
  useEffect(() => {
    setName(effect.name);
    setPaletteUuid(effect.paletteUuid ?? null);
    setLinkedUuid(effect.settingsUuid ?? null);
  }, [effect.uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hydrate preset-level fields whenever the linked preset changes.
  const linkedPreset = useMemo(
    () => (linkedUuid ? presetsForType.find((p) => p.uuid === linkedUuid) : undefined),
    [presetsForType, linkedUuid],
  );
  useEffect(() => {
    if (linkedPreset) {
      setPresetName(linkedPreset.name);
      setSettings(linkedPreset.settings ?? {});
    } else {
      setPresetName("");
      setSettings({});
    }
  }, [linkedPreset?.uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  const errors = useMemo(
    () => (schema ? validateSettings(schema.fields, settings) : {}),
    [schema, settings],
  );
  const hasErrors = Object.keys(errors).length > 0;

  const color = "#4488ff";
  const bg = previewBackground(effect.type, color);
  const isGradient = bg.startsWith("linear-gradient");

  const valid = Boolean(name.trim()) && (!linkedPreset || presetName.trim().length > 0) && !hasErrors;

  // Detect whether the linked preset itself was edited (vs just swapped).
  const presetChanged = useMemo(() => {
    if (!linkedPreset) return false;
    const nameChanged = presetName.trim() !== linkedPreset.name;
    const settingsChanged =
      JSON.stringify(settings ?? {}) !== JSON.stringify(linkedPreset.settings ?? {});
    return nameChanged || settingsChanged;
  }, [linkedPreset, presetName, settings]);

  const presetSelectData = presetsForType.map((p) => ({
    value: p.uuid,
    label: p.isDefault ? `${p.name} (default)` : p.name,
  }));

  const submit = () => {
    if (!valid) return;
    const payload: EditEffectPayload = {
      effect: {
        name: name.trim(),
        paletteUuid,
        settingsUuid: linkedUuid,
      },
    };
    if (linkedPreset && presetChanged) {
      payload.preset = {
        uuid: linkedPreset.uuid,
        mutation: {
          name: presetName.trim(),
          settings,
        },
      };
    }
    onSave(payload);
  };

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

        <Stack gap={6}>
          <Text
            ff="var(--mantine-font-family-monospace)"
            size="xs"
            c="dimmed"
            tt="uppercase"
            style={{ letterSpacing: "0.06em" }}
          >
            Linked preset
          </Text>
          <Select
            data-testid="edit-effect-preset-select"
            placeholder={presetsForType.length === 0 ? "No presets for this type" : "Pick a preset"}
            value={linkedUuid}
            onChange={setLinkedUuid}
            data={presetSelectData}
            disabled={presetsForType.length === 0}
            size={isMobile ? "md" : "sm"}
          />
          {linkedPreset && (
            <>
              <TextInput
                data-testid="edit-effect-preset-name"
                label="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.currentTarget.value)}
                size={isMobile ? "md" : "sm"}
              />
              {schema ? (
                <EffectParams
                  fields={schema.fields}
                  value={settings}
                  onChange={setSettings}
                  errors={errors}
                  compact
                />
              ) : (
                <Text size="xs" c="dimmed" fs="italic">
                  No schema available for {effect.type}.
                </Text>
              )}
              {presetChanged && (
                <Text
                  ff="var(--mantine-font-family-monospace)"
                  size="xs"
                  c="var(--neon-amber)"
                  style={{ fontSize: 10, letterSpacing: "0.04em" }}
                >
                  Changes apply to all effects using this preset.
                </Text>
              )}
            </>
          )}
        </Stack>

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
            onClick={submit}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default EditEffectModal;
