import { Box, Group, Text, UnstyledButton } from "@mantine/core";
import { PlusIcon, SlidersIcon } from "@phosphor-icons/react";
import type { ILightEffectSettings } from "~/api/effect_settings/effect_settings_api";

export const NEW_PRESET = "__new__" as const;
export type PresetChoice = typeof NEW_PRESET | string | null;

interface PresetPickerProps {
  presets: ILightEffectSettings[];
  value: PresetChoice;
  onChange: (v: PresetChoice) => void;
  /** Prefix used for the list rows' `data-testid` attributes. */
  testIdPrefix: string;
}

export function PresetPicker({ presets, value, onChange, testIdPrefix }: PresetPickerProps) {
  return (
    <Box
      style={{
        border: "1px solid var(--mantine-color-default-border)",
        borderRadius: 3,
        background: "var(--neon-bg)",
        padding: 5,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxHeight: 200,
        overflowY: "auto",
      }}
    >
      <PresetRow
        isNew
        active={value === NEW_PRESET}
        onSelect={() => onChange(NEW_PRESET)}
        testId={`${testIdPrefix}-new`}
      />
      {presets.map((p) => (
        <PresetRow
          key={p.uuid}
          preset={p}
          active={value === p.uuid}
          onSelect={() => onChange(p.uuid)}
          testId={`${testIdPrefix}-${p.uuid}`}
        />
      ))}
    </Box>
  );
}

function PresetRow({
  preset,
  isNew,
  active,
  onSelect,
  testId,
}: {
  preset?: ILightEffectSettings;
  isNew?: boolean;
  active: boolean;
  onSelect: () => void;
  testId: string;
}) {
  return (
    <UnstyledButton
      onClick={onSelect}
      data-testid={testId}
      style={{
        background: active ? "var(--neon-accent-dim)" : "var(--mantine-color-default)",
        border: `1px solid ${active ? "var(--neon-accent)" : "var(--mantine-color-default-border)"}`,
        borderRadius: 4,
        padding: "8px 10px",
        width: "100%",
        transition: "all .15s",
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <Box
          style={{
            width: 24,
            height: 24,
            borderRadius: 3,
            flexShrink: 0,
            background: isNew ? "var(--mantine-color-default)" : "var(--neon-bg2)",
            border: `1px solid ${active ? "var(--neon-accent)" : "var(--mantine-color-default-border)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: active ? "var(--neon-accent)" : "var(--neon-text3)",
          }}
        >
          {isNew ? <PlusIcon size={12} weight="bold" /> : <SlidersIcon size={12} />}
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" fw={500} c={active ? "var(--neon-accent)" : undefined} truncate>
            {isNew ? "New preset" : preset?.name}
          </Text>
          <Text
            ff="var(--mantine-font-family-monospace)"
            size="xs"
            c="dimmed"
            tt="uppercase"
            style={{ fontSize: 9, letterSpacing: "0.08em" }}
          >
            {isNew ? "Configure new settings" : preset?.isDefault ? "Default" : "Preset"}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  );
}

export default PresetPicker;
