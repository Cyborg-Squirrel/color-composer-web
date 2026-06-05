import { Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <Stack
      align="center"
      gap="xs"
      py="xl"
      px="md"
      ta="center"
      style={{
        border: "1px dashed var(--mantine-color-default-border)",
        borderRadius: 5,
        color: "var(--neon-text3)",
      }}
    >
      <Text
        ff="var(--mantine-font-family-monospace)"
        size="xs"
        fw={600}
        tt="uppercase"
        style={{ letterSpacing: "0.06em" }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text size="sm" c="dimmed">
          {subtitle}
        </Text>
      )}
      {action}
    </Stack>
  );
}

export default EmptyState;
