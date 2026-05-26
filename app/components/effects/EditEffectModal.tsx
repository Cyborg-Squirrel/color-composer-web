import { Box, Button, Group, Modal, Paper, Select, Stack, Text, TextInput, useModalsStack } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import type {
  ILightEffectSettings,
  ILightEffectSettingsMutation,
} from "~/api/effect_settings/effect_settings_api";
import { findSchema, validateSettings, type ILightEffect } from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { previewBackground } from "~/constants/effects";
import { useEffectSchemas } from "~/provider/EffectApiContext";
import EffectParams from "./EffectParams";
import { NEW_PRESET, PresetPicker, type PresetChoice } from "./PresetPicker";

export type EditEffectPresetChoice =
  | {
      kind: "existing";
      settingsUuid: string;
      /** Set if the user edited the linked preset's name or settings in place. */
      mutation?: Partial<ILightEffectSettingsMutation>;
    }
  | { kind: "new"; mutation: ILightEffectSettingsMutation };

export interface EditEffectPayload {
  effect: {
    name: string;
    paletteUuid: string | null;
    /** Selected strip — null means unassign from any strip. */
    stripUuid: string | null;
  };
  preset: EditEffectPresetChoice;
}

interface EditEffectModalProps {
  effect: ILightEffect;
  strips: ILedStrip[];
  palettes: IPalette[];
  presets: ILightEffectSettings[];
  isMobile?: boolean;
  onClose: () => void;
  onSave: (payload: EditEffectPayload) => void;
}

export function EditEffectModal({
  effect,
  strips,
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
  const [stripUuid, setStripUuid] = useState<string | null>(effect.stripUuid ?? null);
  const [presetChoice, setPresetChoice] = useState<PresetChoice>(effect.settingsUuid ?? null);
  const [presetName, setPresetName] = useState<string>("");
  const [settings, setSettings] = useState<Record<string, unknown>>({});

  // Hydrate effect-level fields when the modal opens for a new effect.
  useEffect(() => {
    setName(effect.name);
    setPaletteUuid(effect.paletteUuid ?? null);
    setStripUuid(effect.stripUuid ?? null);
    setPresetChoice(effect.settingsUuid ?? null);
  }, [effect.uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPreset = useMemo(
    () =>
      presetChoice && presetChoice !== NEW_PRESET
        ? presetsForType.find((p) => p.uuid === presetChoice)
        : undefined,
    [presetsForType, presetChoice],
  );

  // Hydrate preset-level fields whenever the chosen preset changes.
  // For an existing preset, mirror its current name+settings (which the user can then edit).
  // For "new preset", reset to a sensible default.
  useEffect(() => {
    if (presetChoice === NEW_PRESET) {
      setPresetName(`${effect.type} preset`);
      setSettings({});
    } else if (selectedPreset) {
      setPresetName(selectedPreset.name);
      setSettings(selectedPreset.settings ?? {});
    } else {
      setPresetName("");
      setSettings({});
    }
  }, [presetChoice, selectedPreset?.uuid]); // eslint-disable-line react-hooks/exhaustive-deps

  const errors = useMemo(
    () => (schema ? validateSettings(schema.fields, settings) : {}),
    [schema, settings],
  );
  const hasErrors = Object.keys(errors).length > 0;

  const color = "#4488ff";
  const bg = previewBackground(effect.type, color);
  const isGradient = bg.startsWith("linear-gradient");

  const presetValid =
    presetChoice === NEW_PRESET
      ? Boolean(presetName.trim()) && !hasErrors
      : selectedPreset
        ? Boolean(presetName.trim()) && !hasErrors
        : Boolean(presetChoice);
  const valid = Boolean(name.trim()) && presetValid;

  // Detect whether the linked existing preset itself was edited in place
  // (vs just swapped to a different preset).
  const presetChanged = useMemo(() => {
    if (!selectedPreset) return false;
    const nameChanged = presetName.trim() !== selectedPreset.name;
    const settingsChanged =
      JSON.stringify(settings ?? {}) !== JSON.stringify(selectedPreset.settings ?? {});
    return nameChanged || settingsChanged;
  }, [selectedPreset, presetName, settings]);

  // Dirty = any field diverges from the effect's initial state.
  const dirty =
    name !== effect.name ||
    paletteUuid !== (effect.paletteUuid ?? null) ||
    stripUuid !== (effect.stripUuid ?? null) ||
    presetChoice !== (effect.settingsUuid ?? null) ||
    (Boolean(selectedPreset) && presetChanged);

  const stack = useModalsStack(["main", "confirm-discard"]);

  const requestClose = () => {
    if (dirty) {
      stack.open("confirm-discard");
    } else {
      onClose();
    }
  };

  const discard = () => {
    stack.close("confirm-discard");
    onClose();
  };

  const submit = () => {
    if (!valid) return;
    let preset: EditEffectPresetChoice;
    if (presetChoice === NEW_PRESET) {
      preset = {
        kind: "new",
        mutation: {
          type: effect.type,
          name: presetName.trim(),
          settings,
        },
      };
    } else if (selectedPreset) {
      preset = {
        kind: "existing",
        settingsUuid: selectedPreset.uuid,
        ...(presetChanged
          ? { mutation: { name: presetName.trim(), settings } }
          : {}),
      };
    } else {
      return;
    }
    onSave({
      effect: { name: name.trim(), paletteUuid, stripUuid },
      preset,
    });
  };

  return (
    <Modal.Stack>
    <Modal
      {...stack.register("main")}
      opened={Boolean(effect)}
      onClose={requestClose}
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
            Preset
          </Text>
          <PresetPicker
            presets={presetsForType}
            value={presetChoice}
            onChange={setPresetChoice}
            testIdPrefix="edit-effect-preset"
          />
          {(presetChoice === NEW_PRESET || selectedPreset) && (
            <>
              <TextInput
                data-testid="edit-effect-preset-name"
                label="Preset name"
                withAsterisk
                value={presetName}
                onChange={(e) => setPresetName(e.currentTarget.value)}
                size={isMobile ? "md" : "sm"}
              />
              <Paper
                withBorder
                p="md"
                radius="sm"
                style={{ background: "var(--neon-bg)" }}
              >
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
              </Paper>
              {selectedPreset && presetChanged && (
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
          data-testid="edit-effect-strip"
          label="Strip"
          placeholder="Unassigned"
          clearable
          value={stripUuid}
          onChange={setStripUuid}
          data={strips.map((s) => ({ value: s.uuid, label: s.name }))}
          size={isMobile ? "md" : "sm"}
        />

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
          <Button variant="default" onClick={requestClose} data-testid="edit-effect-cancel">
            Cancel
          </Button>
          <Button
            data-testid="edit-effect-save"
            disabled={!valid || !dirty}
            onClick={submit}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
    <Modal
      {...stack.register("confirm-discard")}
      title={<div style={{ fontWeight: 600 }}>Discard changes?</div>}
      radius="md"
      size="sm"
      centered
    >
      <Text size="sm" mb="lg">
        You have unsaved changes. Close anyway?
      </Text>
      <Group justify="flex-end">
        <Button data-testid="edit-effect-discard" variant="default" onClick={discard}>
          Discard
        </Button>
        <Button
          data-testid="edit-effect-keep-editing"
          onClick={() => stack.close("confirm-discard")}
        >
          Keep editing
        </Button>
      </Group>
    </Modal>
    </Modal.Stack>
  );
}

export default EditEffectModal;
