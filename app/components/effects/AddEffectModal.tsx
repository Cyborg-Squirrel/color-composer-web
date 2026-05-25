import {
  Box,
  Button,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useModalsStack,
} from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type {
  ILightEffectSettings,
  ILightEffectSettingsMutation,
} from "~/api/effect_settings/effect_settings_api";
import {
  EFFECT_CATEGORIES,
  findSchema,
  validateSettings,
  type EffectCategoryFilter,
} from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import { useEffectSchemas } from "~/provider/EffectApiContext";
import EffectCard from "./EffectCard";
import EffectParams from "./EffectParams";

export type AddEffectPresetChoice =
  | { kind: "existing"; settingsUuid: string }
  | { kind: "new"; mutation: ILightEffectSettingsMutation };

export interface AddEffectPayload {
  name: string;
  effectType: string;
  paletteUuid: string | null;
  preset: AddEffectPresetChoice;
}

interface AddEffectModalProps {
  opened: boolean;
  onClose: () => void;
  onCreate: (payload: AddEffectPayload) => void;
  /** Pre-selected effect type (e.g. when launched from a catalog card). */
  initialEffectType?: string | null;
  palettes: IPalette[];
  presets: ILightEffectSettings[];
  isMobile?: boolean;
  /** Display name of the target strip/pool, used as a context hint. */
  targetName?: string | null;
}

type PresetMode = "existing" | "new";

export function AddEffectModal({
  opened,
  onClose,
  onCreate,
  initialEffectType = null,
  palettes,
  presets,
  isMobile = false,
  targetName,
}: AddEffectModalProps) {
  const [effectType, setEffectType] = useState<string | null>(initialEffectType);
  const [name, setName] = useState<string>("");
  const [nameTouched, setNameTouched] = useState(false);
  const [presetMode, setPresetMode] = useState<PresetMode>("new");
  const [selectedPresetUuid, setSelectedPresetUuid] = useState<string | null>(null);
  const [presetName, setPresetName] = useState<string>("");
  const [presetNameTouched, setPresetNameTouched] = useState(false);
  const [params, setParams] = useState<Record<string, unknown>>({});
  const [paletteUuid, setPaletteUuid] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EffectCategoryFilter>("All");
  const { schemas } = useEffectSchemas();
  const schema = findSchema(schemas, effectType);

  // Reset state every time the modal opens.
  useMemoReset(opened, () => {
    setEffectType(initialEffectType);
    setName(initialEffectType ?? "");
    setNameTouched(false);
    setPresetMode("new");
    setSelectedPresetUuid(null);
    setPresetName("");
    setPresetNameTouched(false);
    setParams({});
    setPaletteUuid(null);
    setSearch("");
    setFilter("All");
  });

  const filtered = useMemo(
    () =>
      schemas.filter(
        (s) =>
          (filter === "All" || s.category === filter) &&
          (!search || s.effectName.toLowerCase().includes(search.toLowerCase())),
      ),
    [schemas, filter, search],
  );

  const presetsForType = useMemo(
    () => (effectType ? presets.filter((p) => p.type === effectType) : []),
    [presets, effectType],
  );

  // When the type changes, auto-select the default preset (or first available) and switch
  // to "existing" mode; if no presets exist for the type, default to "new".
  useEffect(() => {
    if (!effectType) {
      setSelectedPresetUuid(null);
      return;
    }
    const matches = presets.filter((p) => p.type === effectType);
    if (matches.length === 0) {
      setPresetMode("new");
      setSelectedPresetUuid(null);
    } else {
      const def = matches.find((p) => p.isDefault) ?? matches[0];
      setPresetMode("existing");
      setSelectedPresetUuid(def.uuid);
    }
  }, [effectType]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPreset = useMemo(
    () => (selectedPresetUuid ? presetsForType.find((p) => p.uuid === selectedPresetUuid) : undefined),
    [presetsForType, selectedPresetUuid],
  );

  const pick = (id: string) => {
    setEffectType(id);
    setParams({});
    if (!nameTouched) setName(id);
    if (!presetNameTouched) setPresetName(`${id} preset`);
  };

  const errors = useMemo(
    () => (schema && presetMode === "new" ? validateSettings(schema.fields, params) : {}),
    [schema, params, presetMode],
  );
  const hasErrors = Object.keys(errors).length > 0;

  const presetValid =
    presetMode === "existing"
      ? Boolean(selectedPresetUuid)
      : Boolean(presetName.trim()) && !hasErrors;
  const valid = Boolean(effectType && name.trim()) && presetValid;

  // Dirty = user has interacted enough that closing would lose work.
  const initialName = initialEffectType ?? "";
  const dirty =
    effectType !== initialEffectType ||
    name !== initialName ||
    presetName.trim().length > 0 ||
    Object.keys(params).length > 0 ||
    paletteUuid !== null;

  const stack = useModalsStack(["main", "confirm-discard"]);

  const submit = () => {
    if (!effectType || !valid) return;
    const preset: AddEffectPresetChoice =
      presetMode === "existing" && selectedPresetUuid
        ? { kind: "existing", settingsUuid: selectedPresetUuid }
        : {
            kind: "new",
            mutation: {
              type: effectType,
              name: presetName.trim(),
              settings: params,
            },
          };
    onCreate({
      name: name.trim(),
      effectType,
      paletteUuid,
      preset,
    });
  };

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

  const presetSelectData = presetsForType.map((p) => ({
    value: p.uuid,
    label: p.isDefault ? `${p.name} (default)` : p.name,
  }));

  return (
    <Modal.Stack>
    <Modal
      {...stack.register("main")}
      opened={opened}
      onClose={requestClose}
      title={`Add Effect${targetName ? ` — ${targetName}` : ""}`}
      radius="md"
      size="lg"
      fullScreen={isMobile}
      centered
    >
      <Stack gap="md">
        <TextInput
          data-testid="add-effect-name"
          label="Effect name"
          withAsterisk
          value={name}
          onChange={(e) => {
            setName(e.currentTarget.value);
            setNameTouched(true);
          }}
          placeholder="e.g. Living Room Rainbow"
          size={isMobile ? "md" : "sm"}
        />

        <Box
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 14,
            minHeight: 300,
          }}
        >
          <Stack gap="xs" style={{ minWidth: 0 }}>
            <TextInput
              data-testid="add-effect-search"
              placeholder="Search effects…"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<MagnifyingGlassIcon size={14} />}
              size={isMobile ? "md" : "sm"}
            />
            <Group gap={4} wrap="wrap">
              {EFFECT_CATEGORIES.map((cat) => {
                const active = filter === cat;
                return (
                  <UnstyledButton
                    key={cat}
                    onClick={() => setFilter(cat)}
                    style={{
                      padding: "3px 8px",
                      fontFamily: "var(--mantine-font-family-monospace)",
                      fontSize: 9,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderRadius: 3,
                      border: `1px solid ${active ? "var(--neon-accent)" : "var(--mantine-color-default-border)"}`,
                      background: active ? "var(--neon-accent-dim)" : "var(--mantine-color-default)",
                      color: active ? "var(--neon-accent)" : "var(--neon-text3)",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </UnstyledButton>
                );
              })}
            </Group>
            <Box
              style={{
                flex: 1,
                overflowY: "auto",
                maxHeight: 320,
                minHeight: 200,
                border: "1px solid var(--mantine-color-default-border)",
                borderRadius: 3,
                padding: 5,
                background: "var(--neon-bg)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {filtered.length === 0 ? (
                <Text ta="center" py="md" size="xs" c="dimmed">
                  No effects match
                </Text>
              ) : (
                filtered.map((s) => (
                  <EffectCard
                    key={s.effectName}
                    schema={s}
                    active={effectType === s.effectName}
                    onSelect={() => pick(s.effectName)}
                  />
                ))
              )}
            </Box>
          </Stack>

          <Stack gap="xs" style={{ minWidth: 0 }}>
            <Group justify="space-between" align="center">
              <Text
                ff="var(--mantine-font-family-monospace)"
                size="xs"
                c="dimmed"
                tt="uppercase"
                style={{ letterSpacing: "0.06em" }}
              >
                Preset
              </Text>
              <SegmentedControl
                data-testid="add-effect-preset-mode"
                size="xs"
                value={presetMode}
                onChange={(v) => setPresetMode(v as PresetMode)}
                data={[
                  { value: "existing", label: "Existing", disabled: presetsForType.length === 0 },
                  { value: "new", label: "New" },
                ]}
              />
            </Group>

            {presetMode === "existing" ? (
              <>
                <Select
                  data-testid="add-effect-preset-select"
                  placeholder={presetsForType.length === 0 ? "No presets for this type" : "Pick a preset"}
                  value={selectedPresetUuid}
                  onChange={setSelectedPresetUuid}
                  data={presetSelectData}
                  disabled={presetsForType.length === 0 || !effectType}
                  size={isMobile ? "md" : "sm"}
                />
                <Paper
                  withBorder
                  p="md"
                  radius="sm"
                  style={{ background: "var(--neon-bg)", flex: 1, minHeight: 160 }}
                >
                  {!selectedPreset ? (
                    <Text size="xs" c="dimmed" fs="italic">
                      {effectType ? "Pick a preset above, or switch to New." : "Pick an effect first."}
                    </Text>
                  ) : !schema ? (
                    <Text size="xs" c="dimmed" fs="italic">
                      No schema available for {effectType}.
                    </Text>
                  ) : (
                    <PresetReadonly fields={schema.fields} settings={selectedPreset.settings} />
                  )}
                </Paper>
              </>
            ) : (
              <>
                <TextInput
                  data-testid="add-effect-preset-name"
                  label="Preset name"
                  withAsterisk
                  value={presetName}
                  onChange={(e) => {
                    setPresetName(e.currentTarget.value);
                    setPresetNameTouched(true);
                  }}
                  placeholder="e.g. Slow rainbow"
                  size={isMobile ? "md" : "sm"}
                />
                <Paper
                  withBorder
                  p="md"
                  radius="sm"
                  style={{ background: "var(--neon-bg)", flex: 1, minHeight: 160 }}
                >
                  {!schema ? (
                    <Text size="xs" c="dimmed" fs="italic">
                      {effectType ? `No schema available for ${effectType}.` : "Pick an effect to configure."}
                    </Text>
                  ) : (
                    <EffectParams fields={schema.fields} value={params} onChange={setParams} errors={errors} compact />
                  )}
                </Paper>
              </>
            )}

            <Select
              data-testid="add-effect-palette"
              label="Palette (optional)"
              placeholder="None"
              clearable
              value={paletteUuid}
              onChange={setPaletteUuid}
              data={palettes.map((p) => ({ value: p.uuid, label: p.name }))}
              size={isMobile ? "md" : "sm"}
            />
          </Stack>
        </Box>

        <Group justify="flex-end">
          <Button variant="default" onClick={requestClose}>
            Cancel
          </Button>
          <Button data-testid="add-effect-create" disabled={!valid} onClick={submit}>
            Create Effect
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
        You have unsaved effect details. Close anyway?
      </Text>
      <Group justify="flex-end">
        <Button data-testid="add-effect-discard" variant="default" onClick={discard}>
          Discard
        </Button>
        <Button
          data-testid="add-effect-keep-editing"
          onClick={() => stack.close("confirm-discard")}
        >
          Keep editing
        </Button>
      </Group>
    </Modal>
    </Modal.Stack>
  );
}

/** Read-only summary of a preset's settings — used when the user picked an existing preset. */
function PresetReadonly({
  fields,
  settings,
}: {
  fields: { key: string; description?: string }[];
  settings: Record<string, unknown>;
}) {
  if (fields.length === 0) {
    return (
      <Text size="xs" c="dimmed" fs="italic">
        This effect has no configurable parameters.
      </Text>
    );
  }
  return (
    <Stack gap={6}>
      {fields.map((f) => {
        const v = settings[f.key];
        return (
          <Group key={f.key} justify="space-between" wrap="nowrap">
            <Text
              ff="var(--mantine-font-family-monospace)"
              size="xs"
              c="dimmed"
              tt="uppercase"
              style={{ letterSpacing: "0.05em" }}
            >
              {f.key}
            </Text>
            <Text ff="var(--mantine-font-family-monospace)" size="xs">
              {v === undefined || v === null || v === "" ? "—" : String(v)}
            </Text>
          </Group>
        );
      })}
    </Stack>
  );
}

/**
 * Tiny helper — re-runs an effect every time the boolean transitions
 * from false to true. Used to reset modal form state on open.
 */
function useMemoReset(trigger: boolean, fn: () => void) {
  // useMemo so the reset fires synchronously during render of the first opened
  // frame (avoids a brief flash of the previous state).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => { if (trigger) fn(); }, [trigger]);
}

export default AddEffectModal;
