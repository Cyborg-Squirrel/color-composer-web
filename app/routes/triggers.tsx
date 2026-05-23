import { Badge, Stack, Text } from "@mantine/core";
import { TimerIcon } from "@phosphor-icons/react";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { EmptyState } from "~/components/util/EmptyState";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Triggers | Color Composer" },
    { name: "description", content: "Triggers" },
  ];
}

export default function Triggers() {
  return (
    <Layout>
      <BasicAppShell
        title="Color Composer"
        pageName="Triggers"
        topPadding="xs"
        containerSize="md"
        boxCssEnabled={false}
      >
        <Stack gap="md" align="center" py="xl">
          <Badge color="yellow" variant="light" size="lg">Work in progress</Badge>
          <EmptyState
            icon={<TimerIcon size={32} weight="duotone" />}
            title="Triggers coming soon"
            subtitle="Time- and event-based automation will live here."
          />
          <Text size="xs" c="dimmed" ta="center" maw={420}>
            Triggers will let you schedule effects (sunrise, sunset, cron) and react to system
            events. The API and UI are still being designed.
          </Text>
        </Stack>
      </BasicAppShell>
    </Layout>
  );
}
