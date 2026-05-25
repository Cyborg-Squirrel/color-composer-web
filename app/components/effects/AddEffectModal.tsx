import {
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Stepper,
  Select,
  Text,
  TextInput,
  UnstyledButton,
  useModalsStack,
} from "@mantine/core";
import {
  CheckIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  PaletteIcon,
  SlidersIcon,
} from "@phosphor-icons/react";
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
import { NEW_PRESET, PresetPicker, type PresetChoice } from "./PresetPicker";

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
  const [active, setActive] = useState(0);
  const [highest, setHighest] = useState(0);
  const [effectType, setEffectType] = useState<string | null>(initialEffectType);
  const [name, setName] = useState<string>("");
  const [nameTouched, setNameTouched] = useState(false);
  const [presetChoice, setPresetChoice] = useState<PresetChoice>(null);
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
    setActive(0);
    setHighest(0);
    setEffectType(initialEffectType);
    setName(initialEffectType ?? "");
    setNameTouched(false);
    setPresetChoice(null);
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

  // When the type changes, default the preset choice: pick the default preset
  // (or first available) if any exist, otherwise fall back to "new".
  useEffect(() => {
    if (!effectType) {
      setPresetChoice(null);
      return;
    }
    const matches = presets.filter((p) => p.type === effectType);
    if (matches.length === 0) {
      setPresetChoice(NEW_PRESET);
    } else {
      const def = matches.find((p) => p.isDefault) ?? matches[0];
      setPresetChoice(def.uuid);
    }
  }, [effectType]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPreset = useMemo(
    () =>
      presetChoice && presetChoice !== NEW_PRESET
        ? presetsForType.find((p) => p.uuid === presetChoice)
        : undefined,
    [presetsForType, presetChoice],
  );

  const pick = (id: string) => {
    setEffectType(id);
    setParams({});
    if (!nameTouched) setName(id);
    if (!presetNameTouched) setPresetName(`${id} preset`);
  };

  const errors = useMemo(
    () => (schema && presetChoice === NEW_PRESET ? validateSettings(schema.fields, params) : {}),
    [schema, params, presetChoice],
  );
  const hasErrors = Object.keys(errors).length > 0;

  const step1Valid = Boolean(effectType);
  const presetValid =
    presetChoice === NEW_PRESET
      ? Boolean(presetName.trim()) && !hasErrors
      : Boolean(presetChoice);
  const step2Valid = Boolean(name.trim()) && presetValid;
  const canCreate = step1Valid && step2Valid;

  // Dirty once the user has reached the Preset step (index 1) at any point —
  // even if they navigate back to step 1, we still confirm before discarding.
  const dirty = highest >= 1;

  const stack = useModalsStack(["main", "confirm-discard"]);

  const advance = (n: number) => {
    setActive(n);
    setHighest((h) => Math.max(h, n));
  };
  const goNext = () => {
    if (active === 0 && step1Valid) advance(1);
    else if (active === 1 && step2Valid) advance(2);
  };
  const goBack = () => setActive((c) => Math.max(c - 1, 0));

  const submit = () => {
    if (!effectType || !canCreate) return;
    const preset: AddEffectPresetChoice =
      presetChoice && presetChoice !== NEW_PRESET
        ? { kind: "existing", settingsUuid: presetChoice }
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
          <Stepper
            active={active}
            onStepClick={advance}
            allowNextStepsSelect={false}
            size="xs"
            iconSize={28}
          >
            <Stepper.Step
              label="Effect"
              description="Choose a type"
              icon={<LightningIcon size={14} weight="fill" />}
              completedIcon={<CheckIcon size={14} weight="bold" />}
            >
              <Step1ChooseType
                schemas={filtered}
                effectType={effectType}
                onPick={pick}
                search={search}
                onSearch={setSearch}
                filter={filter}
                onFilter={setFilter}
                isMobile={isMobile}
              />
            </Stepper.Step>

            <Stepper.Step
              label="Preset"
              description="Name and configure"
              icon={<SlidersIcon size={14} />}
              completedIcon={<CheckIcon size={14} weight="bold" />}
            >
              <Step2NamePreset
                effectType={effectType}
                name={name}
                onName={(v) => { setName(v); setNameTouched(true); }}
                presetsForType={presetsForType}
                presetChoice={presetChoice}
                onPresetChoice={setPresetChoice}
                selectedPreset={selectedPreset}
                presetName={presetName}
                onPresetName={(v) => { setPresetName(v); setPresetNameTouched(true); }}
                schema={schema}
                params={params}
                onParams={setParams}
                errors={errors}
                isMobile={isMobile}
              />
            </Stepper.Step>

            <Stepper.Step
              label="Palette"
              description="Optional"
              icon={<PaletteIcon size={14} />}
              completedIcon={<CheckIcon size={14} weight="bold" />}
            >
              <Step3Palette
                palettes={palettes}
                paletteUuid={paletteUuid}
                onPalette={setPaletteUuid}
                isMobile={isMobile}
              />
            </Stepper.Step>
          </Stepper>

          <Group justify="space-between">
            <Button variant="default" onClick={requestClose}>
              Cancel
            </Button>
            <Group gap="xs">
              {active > 0 && (
                <Button variant="default" onClick={goBack} data-testid="add-effect-back">
                  Back
                </Button>
              )}
              {active < 2 ? (
                <Button
                  data-testid="add-effect-next"
                  disabled={active === 0 ? !step1Valid : !step2Valid}
                  onClick={goNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  data-testid="add-effect-create"
                  disabled={!canCreate}
                  onClick={submit}
                >
                  Create Effect
                </Button>
              )}
            </Group>
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

/* ─────────────────────────── Step 1 ─────────────────────────── */

function Step1ChooseType({
  schemas,
  effectType,
  onPick,
  search,
  onSearch,
  filter,
  onFilter,
  isMobile,
}: {
  schemas: ReturnType<typeof useEffectSchemas>["schemas"];
  effectType: string | null;
  onPick: (id: string) => void;
  search: string;
  onSearch: (v: string) => void;
  filter: EffectCategoryFilter;
  onFilter: (v: EffectCategoryFilter) => void;
  isMobile: boolean;
}) {
  return (
    <Stack gap="xs" mt="md">
      <TextInput
        data-testid="add-effect-search"
        placeholder="Search effects…"
        value={search}
        onChange={(e) => onSearch(e.currentTarget.value)}
        leftSection={<MagnifyingGlassIcon size={14} />}
        size={isMobile ? "md" : "sm"}
      />
      <Group gap={4} wrap="wrap">
        {EFFECT_CATEGORIES.map((cat) => {
          const active = filter === cat;
          return (
            <UnstyledButton
              key={cat}
              onClick={() => onFilter(cat)}
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
          overflowY: "auto",
          maxHeight: 340,
          minHeight: 240,
          border: "1px solid var(--mantine-color-default-border)",
          borderRadius: 3,
          padding: 5,
          background: "var(--neon-bg)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {schemas.length === 0 ? (
          <Text ta="center" py="md" size="xs" c="dimmed">
            No effects match
          </Text>
        ) : (
          schemas.map((s) => (
            <EffectCard
              key={s.effectName}
              schema={s}
              active={effectType === s.effectName}
              onSelect={() => onPick(s.effectName)}
            />
          ))
        )}
      </Box>
    </Stack>
  );
}

/* ─────────────────────────── Step 2 ─────────────────────────── */

function Step2NamePreset({
  effectType,
  name,
  onName,
  presetsForType,
  presetChoice,
  onPresetChoice,
  selectedPreset,
  presetName,
  onPresetName,
  schema,
  params,
  onParams,
  errors,
  isMobile,
}: {
  effectType: string | null;
  name: string;
  onName: (v: string) => void;
  presetsForType: ILightEffectSettings[];
  presetChoice: PresetChoice;
  onPresetChoice: (v: PresetChoice) => void;
  selectedPreset: ILightEffectSettings | undefined;
  presetName: string;
  onPresetName: (v: string) => void;
  schema: ReturnType<typeof findSchema>;
  params: Record<string, unknown>;
  onParams: (v: Record<string, unknown>) => void;
  errors: Record<string, string>;
  isMobile: boolean;
}) {
  const isNew = presetChoice === NEW_PRESET;

  return (
    <Stack gap="md" mt="md">
      <TextInput
        data-testid="add-effect-name"
        label="Effect name"
        withAsterisk
        value={name}
        onChange={(e) => onName(e.currentTarget.value)}
        placeholder="e.g. Living Room Rainbow"
        size={isMobile ? "md" : "sm"}
      />

      <Stack gap={6}>
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
        </Group>

        <PresetPicker
          presets={presetsForType}
          value={presetChoice}
          onChange={onPresetChoice}
          testIdPrefix="add-effect-preset"
        />

        {isNew ? (
          <>
            <TextInput
              data-testid="add-effect-preset-name"
              label="Preset name"
              withAsterisk
              value={presetName}
              onChange={(e) => onPresetName(e.currentTarget.value)}
              placeholder="e.g. Slow rainbow"
              size={isMobile ? "md" : "sm"}
            />
            <Paper
              withBorder
              p="md"
              radius="sm"
              style={{ background: "var(--neon-bg)" }}
            >
              {!schema ? (
                <Text size="xs" c="dimmed" fs="italic">
                  {effectType ? `No schema available for ${effectType}.` : "Pick an effect first."}
                </Text>
              ) : (
                <EffectParams
                  fields={schema.fields}
                  value={params}
                  onChange={onParams}
                  errors={errors}
                  compact
                />
              )}
            </Paper>
          </>
        ) : selectedPreset && schema ? (
          <Paper
            withBorder
            p="md"
            radius="sm"
            style={{ background: "var(--neon-bg)" }}
          >
            <PresetReadonly fields={schema.fields} settings={selectedPreset.settings} />
          </Paper>
        ) : null}
      </Stack>
    </Stack>
  );
}

/* ─────────────────────────── Step 3 ─────────────────────────── */

function Step3Palette({
  palettes,
  paletteUuid,
  onPalette,
  isMobile,
}: {
  palettes: IPalette[];
  paletteUuid: string | null;
  onPalette: (v: string | null) => void;
  isMobile: boolean;
}) {
  return (
    <Stack gap="md" mt="md">
      <Text size="sm" c="dimmed">
        Optionally assign a palette to this effect. You can leave this empty and assign one later.
      </Text>
      <Select
        data-testid="add-effect-palette"
        label="Palette"
        placeholder="None"
        clearable
        value={paletteUuid}
        onChange={onPalette}
        data={palettes.map((p) => ({ value: p.uuid, label: p.name }))}
        size={isMobile ? "md" : "sm"}
      />
    </Stack>
  );
}

/* ─────────────────────────── Helpers ─────────────────────────── */

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
