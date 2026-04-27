import { Grid, Group, Paper, ScrollArea, Skeleton, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ClientStatus } from '~/api/clients/clients_api';
import type { IHomeData } from '~/api/home/home_api';
import BasicAppShell from '~/components/layouts/BasicAppShell';
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from '~/components/util/TextHelper';
import { useHomeApi } from '~/provider/HomeApiContext';
import { Layout } from '~/root';
import type { Route } from './+types/home';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Home | Color Composer' },
    { name: 'description', content: 'Home' },
  ];
}

export default function Home() {
  return (
    <Layout>
      <BasicAppShell title="Color Composer" pageName="Home" topPadding="sm" boxCssEnabled={false}>
        <HomeContent />
      </BasicAppShell>
    </Layout>
  );
}

const STAT_LABELS = [
  { label: 'Clients', color: 'var(--mantine-color-blue-6)' },
  { label: 'LED Strips', color: 'var(--mantine-color-green-6)' },
  { label: 'Effects', color: 'var(--mantine-color-yellow-6)' },
  { label: 'Palettes', color: 'var(--mantine-color-violet-6)' },
];

function StatCard({ label, color, value, loading }: { label: string; color: string; value: number; loading: boolean }) {
  return (
    <Paper p="md" withBorder radius="sm" bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))">
      <Text size="xs" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.05em' }}>
        {label}
      </Text>
      {loading
        ? <Skeleton height={38} width={48} mt={4} />
        : <Text fw={700} style={{ fontSize: 32, color }}>{value}</Text>
      }
    </Paper>
  );
}

function PanelRow({ children }: { children: React.ReactNode }) {
  return (
    <Group justify="space-between" py={8} style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
      {children}
    </Group>
  );
}

function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <PanelRow key={i}>
          <Skeleton height={14} width={120} />
          <Skeleton height={12} width={60} />
        </PanelRow>
      ))}
    </>
  );
}

function HomeContent() {
  const homeApi = useHomeApi();

  const [data, setData] = useState<IHomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    homeApi.getHomeStats()
      .then(d => {
        setData(d);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading home', err);
        setIsLoading(false);
      });
  }, [homeApi]);

  const statValues = [data?.totalClients ?? 0, data?.totalStrips ?? 0, data?.totalEffects ?? 0, data?.totalPalettes ?? 0];
  const activeEffects = data?.activeEffects ?? [];
  const strips = data?.strips ?? [];
  const clients = data?.clients ?? [];

  return (
    <>
      <Grid mb="md">
        {STAT_LABELS.map((stat, i) => (
          <Grid.Col key={stat.label} span={{ base: 6, sm: 3 }}>
            <StatCard label={stat.label} color={stat.color} value={statValues[i]} loading={isLoading} />
          </Grid.Col>
        ))}
      </Grid>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper p="md" withBorder radius="sm" bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))">
            <Title order={6} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }} mb="md">
              Active Effects
            </Title>
            <ScrollArea h={140}>
              {isLoading ? (
                <SkeletonRows count={2} />
              ) : activeEffects.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl" size="sm">No active effects</Text>
              ) : (
                activeEffects.map(e => {
                  const strip = strips.find(s => s.uuid === e.stripUuid);
                  return (
                    <PanelRow key={e.uuid}>
                      <div>
                        <Text size="sm" fw={500}>{e.name}</Text>
                        {strip && <Text size="xs" c="dimmed">{strip.name}</Text>}
                      </div>
                      <Text size="xs" fw={500} c="green">{e.status}</Text>
                    </PanelRow>
                  );
                })
              )}
            </ScrollArea>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper p="md" withBorder radius="sm" bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))">
            <Title order={6} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }} mb="md">
              Clients
            </Title>
            <ScrollArea h={140}>
              {isLoading ? (
                <SkeletonRows count={3} />
              ) : clients.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl" size="sm">No clients configured</Text>
              ) : (
                clients.map(c => (
                  <PanelRow key={c.uuid}>
                    <Text size="sm" fw={500}>{c.name}</Text>
                    <Text size="xs" fw={500} c={getClientStatusColor(c.status)}>
                      {c.status === ClientStatus.Offline
                        ? 'Offline since ' + getLastSeenAtString(c.lastSeenAt)
                        : getClientStatusText(c.status)}
                    </Text>
                  </PanelRow>
                ))
              )}
            </ScrollArea>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}
