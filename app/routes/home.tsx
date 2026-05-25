import {
  Badge,
  Box,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { CpuIcon, LightbulbIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ClientStatus, NightDriverType, PiClientType, type ILedStripClient } from "~/api/clients/clients_api";
import type { ILightEffectSettings } from "~/api/effect_settings/effect_settings_api";
import { type ILightEffect } from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import type { IStripPool } from "~/api/pools/pools_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import BasicAppShell from "~/components/layouts/BasicAppShell";
import { SectionHeader } from "~/components/util/SectionHeader";
import StatusDot from "~/components/util/StatusDot";
import StripPreviewBar from "~/components/strips/StripPreviewBar";
import {
  buildOnlineByStrip,
  derivePoolPlayState,
  deriveStripPlayState,
  findActiveEffect,
  isClientOnline,
} from "~/components/util/stripHelpers";
import { useClientApi } from "~/provider/ClientApiContext";
import { useEffectApi } from "~/provider/EffectApiContext";
import { useEffectSettingsApi } from "~/provider/EffectSettingsApiContext";
import { useResourceEvents } from "~/provider/EventStreamContext";
import { useHomeApi } from "~/provider/HomeApiContext";
import { usePaletteApi } from "~/provider/PaletteApiContext";
import { usePoolApi } from "~/provider/PoolApiContext";
import { useStripApi } from "~/provider/StripApiContext";
import { Layout } from "~/root";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Color Composer" },
    { name: "description", content: "Home" },
  ];
}

export default function Home() {
  return (
    <Layout>
      <BasicAppShell title="Color Composer" pageName="Home" topPadding="xs" containerSize="md" boxCssEnabled={false}>
        <HomeContent />
      </BasicAppShell>
    </Layout>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent: string;
  onClick?: () => void;
  testId?: string;
}

function StatCard({ label, value, sub, accent, onClick, testId }: StatCardProps) {
  const inner = (
    <Paper
      withBorder
      radius="sm"
      p="md"
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "border-color .15s",
        flex: 1,
        minWidth: 140,
      }}
    >
      <Text
        ff="var(--mantine-font-family-monospace)"
        fw={600}
        style={{ fontSize: 28, color: accent, letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {value}
      </Text>
      <Text size="sm" fw={500} mt={2}>{label}</Text>
      {sub && <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed" mt={2}>{sub}</Text>}
    </Paper>
  );
  if (!onClick) return inner;
  return (
    <UnstyledButton onClick={onClick} data-testid={testId} style={{ flex: 1, minWidth: 140 }}>
      {inner}
    </UnstyledButton>
  );
}

function HomeContent() {
  const navigate = useNavigate();
  const homeApi = useHomeApi();
  const stripApi = useStripApi();
  const clientApi = useClientApi();
  const poolApi = usePoolApi();
  const effectApi = useEffectApi();
  const effectSettingsApi = useEffectSettingsApi();
  const paletteApi = usePaletteApi();

  const [strips, setStrips] = useState<ILedStrip[]>([]);
  const [clients, setClients] = useState<ILedStripClient[]>([]);
  const [pools, setPools] = useState<IStripPool[]>([]);
  const [effects, setEffects] = useState<ILightEffect[]>([]);
  const [presets, setPresets] = useState<ILightEffectSettings[]>([]);
  const [palettes, setPalettes] = useState<IPalette[]>([]);
  const [totals, setTotals] = useState<{ clients: number; strips: number; effects: number; palettes: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      // The /home endpoint gives us totals + a snapshot, but we also fetch pools
      // (which it doesn't include) and prefer the dedicated list endpoints so we
      // get full per-resource shapes for live derivation.
      const [home, s, c, p, e, pal, ps] = await Promise.all([
        homeApi.getHomeStats().catch(() => null),
        stripApi.getStrips().catch(() => [] as ILedStrip[]),
        clientApi.getClients().catch(() => [] as ILedStripClient[]),
        poolApi.getPools().catch(() => [] as IStripPool[]),
        effectApi.getEffects().catch(() => [] as ILightEffect[]),
        paletteApi.getPalettes().catch(() => [] as IPalette[]),
        effectSettingsApi.getEffectSettings().catch(() => [] as ILightEffectSettings[]),
      ]);
      setStrips(s); setClients(c); setPools(p); setEffects(e); setPalettes(pal); setPresets(ps);
      setTotals({
        clients: home?.totalClients ?? c.length,
        strips: home?.totalStrips ?? s.length,
        effects: home?.totalEffects ?? e.length,
        palettes: home?.totalPalettes ?? pal.length,
      });
    } catch (err) {
      console.error("Failed to load home", err);
    } finally {
      setLoading(false);
    }
  }, [homeApi, stripApi, clientApi, poolApi, effectApi, paletteApi, effectSettingsApi]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useResourceEvents(
    ["LedClient", "LedStrip", "StripPool", "LightEffect", "EffectSettings", "Palette"],
    () => { fetchAll(); },
    [],
  );

  const presetByUuid = useMemo(() => {
    const map: Record<string, ILightEffectSettings> = {};
    for (const p of presets) map[p.uuid] = p;
    return map;
  }, [presets]);

  const onlineByStrip = useMemo(() => buildOnlineByStrip(strips, clients), [strips, clients]);

  const onlineClients = clients.filter(isClientOnline).length;
  const offlineClients = clients.length - onlineClients;
  const playingStrips = strips.filter((s) => onlineByStrip[s.uuid] && deriveStripPlayState(s.uuid, effects) === "playing").length;
  const offlineStrips = strips.filter((s) => !onlineByStrip[s.uuid]).length;
  const activePools = pools.filter((p) => derivePoolPlayState(p.uuid, effects) === "playing").length;
  const activeEffectsCount = effects.filter((e) => e.status === "Playing" || e.status === "Paused").length;

  const sortedClients = [...clients].sort((a, b) => {
    const ao = isClientOnline(a) ? 1 : 0;
    const bo = isClientOnline(b) ? 1 : 0;
    if (ao !== bo) return bo - ao;
    const ac = strips.filter((s) => s.clientUuid === a.uuid).length;
    const bc = strips.filter((s) => s.clientUuid === b.uuid).length;
    return bc - ac;
  });

  const openStrip = (s: ILedStrip) => navigate("/strips", { state: { openStripUuid: s.uuid } });
  const openClient = (c: ILedStripClient) => navigate("/clients", { state: { openClientUuid: c.uuid } });

  return (
    <Stack gap="lg">
      <Stack gap={2}>
        <Title order={3}>Overview</Title>
      </Stack>

      <Group gap="sm" wrap="wrap">
        {loading || !totals ? (
          [0, 1, 2, 3].map((i) => <Skeleton key={i} height={88} radius="sm" style={{ flex: 1, minWidth: 140 }} />)
        ) : (
          <>
            <StatCard
              testId="stat-clients-online"
              label="Clients Online"
              value={onlineClients}
              sub={`${offlineClients} offline`}
              accent="var(--neon-accent)"
              onClick={() => navigate("/clients")}
            />
            <StatCard
              testId="stat-effects"
              label="Active Effects"
              value={activeEffectsCount}
              sub={`of ${totals.effects} total`}
              accent={activeEffectsCount > 0 ? "var(--neon-accent)" : "var(--neon-text3)"}
              onClick={() => navigate("/effects")}
            />
            <StatCard
              testId="stat-strips"
              label="Playing"
              value={playingStrips}
              sub={`of ${strips.length} strips${offlineStrips > 0 ? ` · ${offlineStrips} offline` : ""}`}
              accent={playingStrips > 0 ? "var(--neon-accent)" : "var(--neon-text3)"}
              onClick={() => navigate("/strips")}
            />
            <StatCard
              testId="stat-pools"
              label="Pools"
              value={pools.length}
              sub={`${activePools} active`}
              accent="var(--neon-purple)"
              onClick={() => navigate("/strips", { state: { tab: "pools" } })}
            />
          </>
        )}
      </Group>

      <Box>
        <SectionHeader label="Strips" />
        {loading ? (
          <Stack gap={6}>{[0, 1].map((i) => (<Skeleton key={i} height={48} radius="sm" />))}</Stack>
        ) : strips.length === 0 ? (
          <EmptyRow icon={<LightbulbIcon size={16} weight="duotone" />} label="No strips configured" />
        ) : (
          <Stack gap={6}>
            {strips.map((s) => {
              const online = onlineByStrip[s.uuid] !== false;
              const playState = deriveStripPlayState(s.uuid, effects);
              const active = findActiveEffect(s.uuid, effects);
              const client = clients.find((c) => c.uuid === s.clientUuid);
              const activePreset = active?.settingsUuid ? presetByUuid[active.settingsUuid] : undefined;
              const settings = (activePreset?.settings ?? {}) as { color?: string; colorB?: string; speed?: number };
              const stateColor =
                playState === "playing" ? "var(--neon-accent)" :
                playState === "paused" ? "var(--neon-amber)" : "var(--neon-text3)";
              return (
                <Paper
                  key={s.uuid}
                  data-testid={`home-strip-${s.uuid}`}
                  withBorder
                  radius="sm"
                  p="sm"
                  onClick={() => openStrip(s)}
                  style={{ cursor: "pointer", transition: "border-color .15s" }}
                >
                  <Group gap="sm" wrap="nowrap" align="center">
                    <StatusDot online={online} playState={playState} />
                    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                      <Group gap="xs" wrap="nowrap">
                        <Text size="sm" fw={500} truncate>{s.name}</Text>
                        <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed" truncate>
                          {client?.name ?? "—"}
                        </Text>
                      </Group>
                      <StripPreviewBar
                        online={online}
                        playState={playState}
                        brightness={s.brightness}
                        effectType={active?.type ?? null}
                        color={settings.color ?? null}
                        colorB={settings.colorB ?? null}
                        speed={typeof settings.speed === "number" ? settings.speed : 50}
                      />
                    </Stack>
                    <Box style={{ flexShrink: 0, textAlign: "right" }}>
                      <Text
                        ff="var(--mantine-font-family-monospace)"
                        size="xs"
                        tt="uppercase"
                        style={{ color: stateColor, letterSpacing: "0.1em" }}
                      >
                        {online ? playState : "offline"}
                      </Text>
                      <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
                        {s.length}L · {s.brightness}%
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      <Box>
        <SectionHeader label="Clients" />
        {loading ? (
          <Stack gap={6}>{[0, 1].map((i) => (<Skeleton key={i} height={48} radius="sm" />))}</Stack>
        ) : sortedClients.length === 0 ? (
          <EmptyRow icon={<CpuIcon size={16} weight="duotone" />} label="No clients configured" />
        ) : (
          <Stack gap={6}>
            {sortedClients.map((c) => {
              const online = isClientOnline(c);
              const isPi = c.clientType === PiClientType;
              const typeLabel = isPi ? "Pi" : c.clientType === NightDriverType ? "Night Driver" : c.clientType;
              const strippy = strips.filter((s) => s.clientUuid === c.uuid).length;
              return (
                <Paper
                  key={c.uuid}
                  data-testid={`home-client-${c.uuid}`}
                  withBorder
                  radius="sm"
                  p="sm"
                  onClick={() => openClient(c)}
                  style={{ cursor: "pointer", transition: "border-color .15s" }}
                >
                  <Group gap="sm" wrap="nowrap" align="center">
                    <CpuIcon
                      size={16}
                      weight="duotone"
                      style={{ color: online ? "var(--neon-accent)" : "var(--neon-text3)", flexShrink: 0 }}
                    />
                    <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                      <Group gap="xs" wrap="wrap">
                        <Text size="sm" fw={500} c={online ? undefined : "dimmed"} truncate>{c.name}</Text>
                        <Badge
                          size="xs"
                          variant="light"
                          color={isPi ? "violet" : "blue"}
                          ff="var(--mantine-font-family-monospace)"
                        >
                          {typeLabel}
                        </Badge>
                      </Group>
                      <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed">
                        {c.address} · {strippy} {strippy === 1 ? "strip" : "strips"}
                      </Text>
                    </Stack>
                    <Badge size="xs" variant="light" color={online ? "teal" : "gray"}>
                      {c.status === ClientStatus.Offline ? "Offline" : online ? "Online" : c.status}
                    </Badge>
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Palettes-as-context (small footnote — only render when palettes exist) */}
      {palettes.length > 0 && (
        <Box>
          <SectionHeader label="Palettes" />
          <Group gap="sm" wrap="wrap">
            {palettes.slice(0, 6).map((p) => {
              const colors = (p.settings?.colors as string[] | undefined) ?? [];
              return (
                <Paper
                  key={p.uuid}
                  withBorder
                  radius="sm"
                  p="xs"
                  data-testid={`home-palette-${p.uuid}`}
                  onClick={() => navigate("/palettes")}
                  style={{ cursor: "pointer", minWidth: 120, transition: "border-color .15s" }}
                >
                  <Group gap={1} mb={4} wrap="nowrap" style={{ height: 14, borderRadius: 2, overflow: "hidden" }}>
                    {colors.map((c, i) => (
                      <Box key={i} style={{ flex: 1, height: "100%", background: c }} />
                    ))}
                  </Group>
                  <Text size="xs" fw={500} truncate>{p.name}</Text>
                </Paper>
              );
            })}
          </Group>
        </Box>
      )}

    </Stack>
  );
}

function EmptyRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Group gap="xs" justify="center" py="md">
      <Box style={{ opacity: 0.3 }}>{icon}</Box>
      <Text size="sm" c="dimmed">{label}</Text>
    </Group>
  );
}
