import { ColorInput, Group, NumberInput, Select, Slider, Stack, Switch, Text, TextInput, Tooltip } from "@mantine/core";
import { InfoIcon } from "@phosphor-icons/react";
import { validatorOfType, type IEffectSchemaField } from "~/api/effects/effects_api";

interface EffectParamsProps {
  fields: IEffectSchemaField[];
  value: Record<string, unknown>;
  onChange: (settings: Record<string, unknown>) => void;
  compact?: boolean;
  errors?: Record<string, string>;
}

/** Convert a key like `colorB` or `bpm` to a human label ("Color B", "BPM"). */
function humanize(key: string): string {
  if (key.toUpperCase() === key) return key;
  const spaced = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function MonoLabel({ field }: { field: IEffectSchemaField }) {
  return (
    <Group gap={4} wrap="nowrap" align="center">
      <Text
        ff="var(--mantine-font-family-monospace)"
        size="xs"
        c="dimmed"
        tt="uppercase"
        style={{ letterSpacing: "0.05em" }}
      >
        {humanize(field.key)}
      </Text>
      {field.description && (
        <Tooltip label={field.description} openDelay={200} multiline w={220}>
          <InfoIcon size={11} weight="duotone" style={{ color: "var(--neon-text3)" }} />
        </Tooltip>
      )}
    </Group>
  );
}

export function EffectParams({ fields, value, onChange, compact, errors }: EffectParamsProps) {
  if (!fields.length) {
    return (
      <Text size="xs" c="dimmed" fs="italic">
        This effect has no configurable parameters.
      </Text>
    );
  }

  const set = (patch: Record<string, unknown>) => onChange({ ...value, ...patch });

  return (
    <Stack gap={compact ? 8 : "sm"}>
      {fields.map((field) => renderField(field, value, set, errors?.[field.key]))}
    </Stack>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <Text
      ff="var(--mantine-font-family-monospace)"
      size="xs"
      c="red"
      style={{ fontSize: 10, letterSpacing: "0.04em" }}
    >
      {message}
    </Text>
  );
}

function renderField(
  field: IEffectSchemaField,
  value: Record<string, unknown>,
  set: (patch: Record<string, unknown>) => void,
  error: string | undefined,
) {
  const current = value[field.key];
  const min = validatorOfType(field, 'min')?.value;
  const max = validatorOfType(field, 'max')?.value;
  const options = validatorOfType(field, 'options')?.values ?? [];

  switch (field.type) {
    case 'Boolean': {
      const checked = typeof current === 'boolean' ? current : false;
      return (
        <Stack key={field.key} gap={2}>
          <Group justify="space-between" wrap="nowrap">
            <MonoLabel field={field} />
            <Switch
              checked={checked}
              onChange={(e) => set({ [field.key]: e.currentTarget.checked })}
              size="xs"
            />
          </Group>
          {error && <FieldError message={error} />}
        </Stack>
      );
    }
    case 'Integer':
    case 'Number': {
      const isInteger = field.type === 'Integer';
      const raw = typeof current === 'number' ? current : (min ?? 0);
      const hasBothBounds = typeof min === 'number' && typeof max === 'number';
      const step = isInteger ? 1 : Math.max(0.01, ((max ?? 100) - (min ?? 0)) / 100);

      if (hasBothBounds) {
        return (
          <Stack key={field.key} gap={4}>
            <Group justify="space-between" wrap="nowrap">
              <MonoLabel field={field} />
              <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
                {Number.isFinite(raw) ? (isInteger ? Math.round(raw) : raw) : "—"}
              </Text>
            </Group>
            <Slider
              value={Number.isFinite(raw) ? raw : (min as number)}
              min={min as number}
              max={max as number}
              step={step}
              onChange={(v) => set({ [field.key]: isInteger ? Math.round(v) : v })}
              size="xs"
              label={null}
            />
            {error && <FieldError message={error} />}
          </Stack>
        );
      }

      return (
        <Stack key={field.key} gap={2}>
          <Group justify="space-between" wrap="nowrap">
            <MonoLabel field={field} />
            <NumberInput
              size="xs"
              value={Number.isFinite(raw) ? (raw as number) : undefined}
              onChange={(v) => set({ [field.key]: typeof v === 'number' ? (isInteger ? Math.round(v) : v) : undefined })}
              min={min}
              max={max}
              step={step}
              allowDecimal={!isInteger}
              error={Boolean(error)}
              style={{ width: 120 }}
            />
          </Group>
          {error && <FieldError message={error} />}
        </Stack>
      );
    }
    case 'String': {
      const text = typeof current === 'string' ? current : '';
      if (options && options.length > 0) {
        return (
          <Stack key={field.key} gap={2}>
            <Group justify="space-between" wrap="nowrap">
              <MonoLabel field={field} />
              <Select
                size="xs"
                value={options.includes(text) ? text : null}
                onChange={(v) => set({ [field.key]: v ?? '' })}
                data={options}
                error={Boolean(error)}
                style={{ width: 160 }}
              />
            </Group>
            {error && <FieldError message={error} />}
          </Stack>
        );
      }
      return (
        <Stack key={field.key} gap={2}>
          <Group justify="space-between" wrap="nowrap">
            <MonoLabel field={field} />
            <TextInput
              size="xs"
              value={text}
              onChange={(e) => set({ [field.key]: e.currentTarget.value })}
              error={Boolean(error)}
              style={{ width: 160 }}
            />
          </Group>
          {error && <FieldError message={error} />}
        </Stack>
      );
    }
    case 'RgbColor': {
      const text = typeof current === 'string' ? current : '#4488ff';
      return (
        <Stack key={field.key} gap={2}>
          <Group justify="space-between" wrap="nowrap">
            <MonoLabel field={field} />
            <ColorInput
              size="xs"
              value={text}
              onChange={(v) => set({ [field.key]: v })}
              format="hex"
              swatches={["#4488ff", "#ff8844", "#44ffaa", "#8844ff", "#ff44aa", "#ffffff", "#000000"]}
              error={Boolean(error)}
              style={{ width: 160 }}
            />
          </Group>
          {error && <FieldError message={error} />}
        </Stack>
      );
    }
    default:
      return null;
  }
}

export default EffectParams;
