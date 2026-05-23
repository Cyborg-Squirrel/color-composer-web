import { Text } from "@mantine/core";

interface SectionHeaderProps {
  label: string;
}

export function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <Text
      ff="var(--mantine-font-family-monospace)"
      size="xs"
      c="dimmed"
      tt="uppercase"
      fw={600}
      style={{
        letterSpacing: "0.1em",
        borderBottom: "1px solid var(--mantine-color-default-border)",
        paddingBottom: 8,
        marginBottom: 10,
        paddingTop: 14,
      }}
    >
      {label}
    </Text>
  );
}

export default SectionHeader;
