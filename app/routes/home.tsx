import { Grid, Group, Paper, ScrollArea, Skeleton, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ClientStatus, type ILedStripClient } from '~/api/clients/clients_api';
import type { ILightEffect } from '~/api/effects/effects_api';
import type { IPalette } from '~/api/palettes/palettes_api';
import type { ILedStrip } from '~/api/strips/strips_api';
import BasicAppShell from '~/components/layouts/BasicAppShell';
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from '~/components/util/TextHelper';
import { useClientApi } from '~/provider/ClientApiContext';
import { useEffectApi } from '~/provider/EffectApiContext';
import { usePaletteApi } from '~/provider/PaletteApiContext';
import { useStripApi } from '~/provider/StripApiContext';
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
  const clientApi = useClientApi();
  const stripApi = useStripApi();
  const effectApi = useEffectApi();
  const paletteApi = usePaletteApi();

  const [clients, setClients] = useState<ILedStripClient[]>([]);
  const [strips, setStrips] = useState<ILedStrip[]>([]);
  const [effects, setEffects] = useState<ILightEffect[]>([]);
  const [palettes, setPalettes] = useState<IPalette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clientApi.getClients(),
      stripApi.getStrips(),
      effectApi.getEffects(),
      paletteApi.getPalettes(),
    ]).then(([c, s, e, p]) => {
      setClients(c);
      setStrips(s);
      setEffects(e);
      setPalettes(p);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading home data', err);
      setLoading(false);
    });
  }, []);

  const activeEffects = effects.filter(e => {
    if (e.status !== 'Playing') return false;
    const strip = strips.find(s => s.uuid === e.stripUuid);
    const client = clients.find(c => c.uuid === strip?.clientUuid);
    return client?.status !== ClientStatus.Offline;
  });

  const statValues = [clients.length, strips.length, effects.length, palettes.length];

  return (
    <>
      <Grid mb="md">
        {STAT_LABELS.map((stat, i) => (
          <Grid.Col key={stat.label} span={{ base: 6, sm: 3 }}>
            <StatCard label={stat.label} color={stat.color} value={statValues[i]} loading={loading} />
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
              {loading ? (
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
              {loading ? (
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
