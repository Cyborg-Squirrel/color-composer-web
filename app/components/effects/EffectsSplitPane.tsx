import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { CaretLeftIcon, PlayIcon, PlusIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILightEffectSettings } from "~/api/effect_settings/effect_settings_api";
import { LightEffectStatus, type ILightEffect, type LightEffectStatusCommand } from "~/api/effects/effects_api";
import type { IPalette } from "~/api/palettes/palettes_api";
import type { IStripPool } from "~/api/pools/pools_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import PoolCard from "~/components/strips/PoolCard";
import ConfirmDeleteModal from "~/components/util/ConfirmDeleteModal";
import EmptyState from "~/components/util/EmptyState";
import { isMobileUi } from "~/components/util/IsMobile";
import {
  buildConnectedByStrip,
  buildOnlineByStrip,
  comparePoolsActiveFirst,
  compareStripsActiveFirst,
  playStateFromOwn,
} from "~/components/util/stripHelpers";
import { useClientApi } from "~/provider/ClientApiContext";
import { useEffectApi } from "~/provider/EffectApiContext";
import { useEffectSettingsApi } from "~/provider/EffectSettingsApiContext";
import { useResourceEvents } from "~/provider/EventStreamContext";
import { usePaletteApi } from "~/provider/PaletteApiContext";
import { usePoolApi } from "~/provider/PoolApiContext";
import { useStripApi } from "~/provider/StripApiContext";
import AddEffectModal, { type AddEffectPayload } from "./AddEffectModal";
import EditEffectModal, { type EditEffectPayload } from "./EditEffectModal";
import EffectListRow from "./EffectListRow";
import StripCard from "./StripCard";

type SidebarTab = "strips" | "pools";
type MobilePane = "sidebar" | "main";

function isPoolId(id: string, pools: IStripPool[]): boolean {
  return pools.some((p) => p.uuid === id);
}

export function EffectsSplitPane() {
  const stripApi = useStripApi();
  const clientApi = useClientApi();
  const poolApi = usePoolApi();
  const effectApi = useEffectApi();
  const effectSettingsApi = useEffectSettingsApi();
  const paletteApi = usePaletteApi();
  const isMobile = isMobileUi();

  const [strips, setStrips] = useState<ILedStrip[]>([]);
  const [clients, setClients] = useState<ILedStripClient[]>([]);
  const [pools, setPools] = useState<IStripPool[]>([]);
  const [effects, setEffects] = useState<ILightEffect[]>([]);
  const [presets, setPresets] = useState<ILightEffectSettings[]>([]);
  const [palettes, setPalettes] = useState<IPalette[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<SidebarTab>("strips");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<MobilePane>("sidebar");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<ILightEffect | null>(null);
  const [deleting, setDeleting] = useState<ILightEffect | null>(null);
  const [confirmPlay, setConfirmPlay] = useState<{ uuid: string; name: string } | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [s, c, p, e, pal, ps] = await Promise.all([
        stripApi.getStrips(),
        clientApi.getClients(),
        poolApi.getPools(),
        effectApi.getEffects(),
        paletteApi.getPalettes(),
        effectSettingsApi.getEffectSettings(),
      ]);
      setStrips(s); setClients(c); setPools(p); setEffects(e); setPalettes(pal); setPresets(ps);
    } catch (err) {
      console.error("Failed to load effects page", err);
    } finally {
      setLoading(false);
    }
  }, [stripApi, clientApi, poolApi, effectApi, paletteApi, effectSettingsApi]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useResourceEvents(
    ["LedStrip", "LedClient", "StripPool", "LightEffect", "EffectSettings", "Palette"],
    async (event) => {
      try {
        if (event.type.startsWith("LedStrip")) setStrips(await stripApi.getStrips());
        else if (event.type.startsWith("LedClient")) setClients(await clientApi.getClients());
        else if (event.type.startsWith("StripPool")) setPools(await poolApi.getPools());
        else if (event.type.startsWith("LightEffect")) setEffects(await effectApi.getEffects());
        else if (event.type.startsWith("EffectSettings")) setPresets(await effectSettingsApi.getEffectSettings());
        else if (event.type.startsWith("Palette")) setPalettes(await paletteApi.getPalettes());
      } catch (err) {
        console.error("Failed to refresh resource for event", event.type, err);
      }
    },
    [],
  );

  const presetByUuid = useMemo(() => {
    const map: Record<string, ILightEffectSettings> = {};
    for (const p of presets) map[p.uuid] = p;
    return map;
  }, [presets]);

  const presetForEffect = useCallback(
    (effect: ILightEffect | undefined): ILightEffectSettings | undefined =>
      effect?.settingsUuid ? presetByUuid[effect.settingsUuid] : undefined,
    [presetByUuid],
  );

  const paletteByUuid = useMemo(() => {
    const map = new Map<string, IPalette>();
    for (const p of palettes) map.set(p.uuid, p);
    return map;
  }, [palettes]);

  const effectsByStrip = useMemo(() => {
    const map = new Map<string, ILightEffect[]>();
    for (const e of effects) {
      if (!e.stripUuid) continue;
      const bucket = map.get(e.stripUuid);
      if (bucket) bucket.push(e);
      else map.set(e.stripUuid, [e]);
    }
    return map;
  }, [effects]);

  const effectsByPool = useMemo(() => {
    const map = new Map<string, ILightEffect[]>();
    for (const e of effects) {
      if (!e.poolUuid) continue;
      const bucket = map.get(e.poolUuid);
      if (bucket) bucket.push(e);
      else map.set(e.poolUuid, [e]);
    }
    return map;
  }, [effects]);

  const sortedStrips = useMemo(
    () => [...strips].sort(compareStripsActiveFirst),
    [strips],
  );
  const sortedPools = useMemo(
    () => [...pools].sort(comparePoolsActiveFirst),
    [pools],
  );

  // Auto-select first item (post-sort) when entering a tab with no selection.
  useEffect(() => {
    if (tab === "strips" && (!selectedId || !sortedStrips.some((s) => s.uuid === selectedId))) {
      if (sortedStrips[0]) setSelectedId(sortedStrips[0].uuid);
    } else if (tab === "pools" && (!selectedId || !sortedPools.some((p) => p.uuid === selectedId))) {
      if (sortedPools[0]) setSelectedId(sortedPools[0].uuid);
    }
  }, [tab, sortedStrips, sortedPools, selectedId]);

  const onlineByStrip = useMemo(() => buildOnlineByStrip(strips, clients), [strips, clients]);
  const connectedByStrip = useMemo(() => buildConnectedByStrip(strips, clients), [strips, clients]);

  const selectedIsPool = useMemo(
    () => (selectedId ? isPoolId(selectedId, pools) : false),
    [selectedId, pools],
  );
  const selectedStrip = useMemo(
    () => (!selectedIsPool && selectedId ? strips.find((s) => s.uuid === selectedId) : undefined),
    [selectedIsPool, strips, selectedId],
  );
  const selectedPool = useMemo(
    () => (selectedIsPool && selectedId ? pools.find((p) => p.uuid === selectedId) : undefined),
    [selectedIsPool, pools, selectedId],
  );
  const selectedName = selectedStrip?.name ?? selectedPool?.name ?? null;

  const selectedEffects = useMemo<ILightEffect[]>(() => {
    if (selectedStrip) return effectsByStrip.get(selectedStrip.uuid) ?? [];
    if (selectedPool) return effectsByPool.get(selectedPool.uuid) ?? [];
    return [];
  }, [effectsByStrip, effectsByPool, selectedStrip, selectedPool]);

  const activeEffects = useMemo(
    () =>
      selectedEffects
        .filter((e) => e.status !== LightEffectStatus.Inactive)
        .sort((a, b) => a.layer - b.layer),
    [selectedEffects],
  );
  const inactiveEffects = useMemo(
    () => selectedEffects.filter((e) => e.status === LightEffectStatus.Inactive),
    [selectedEffects],
  );

  const handleStripPlayState = async (strip: ILedStrip, cmd: "Play" | "Pause" | "Stop") => {
    const own = effects.filter(
      (e) => e.stripUuid === strip.uuid && e.status !== LightEffectStatus.Inactive,
    );
    if (own.length === 0) return;
    try {
      await effectApi.updateEffectStatus(own.map((e) => e.uuid), cmd);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handlePoolPlayState = async (pool: IStripPool, cmd: "Play" | "Pause" | "Stop") => {
    const own = effects.filter(
      (e) => e.poolUuid === pool.uuid && e.status !== LightEffectStatus.Inactive,
    );
    if (own.length === 0) return;
    try {
      await effectApi.updateEffectStatus(own.map((e) => e.uuid), cmd);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleBrightnessChange = async (strip: ILedStrip, brightness: number) => {
    setStrips((prev) => prev.map((s) => s.uuid === strip.uuid ? { ...s, brightness } : s));
  };
  const commitBrightness = async (strip: ILedStrip) => {
    try { await stripApi.updateStrip(strip.uuid, { brightness: strip.brightness }); }
    catch (err) { console.error(err); }
  };

  const handleCreateEffect = async (payload: AddEffectPayload) => {
    if (!selectedStrip && !selectedPool) return;
    try {
      const settingsUuid =
        payload.preset.kind === "existing"
          ? payload.preset.settingsUuid
          : await effectSettingsApi.createEffectSettings(payload.preset.mutation);
      const uuid = await effectApi.createEffect({
        name: payload.name,
        effectType: payload.effectType,
        stripUuid: selectedStrip?.uuid,
        poolUuid: selectedPool?.uuid,
        settingsUuid,
        paletteUuid: payload.paletteUuid,
      });
      setAddOpen(false);
      // Then prompt the user about playing it.
      setConfirmPlay({ uuid, name: payload.name });
    } catch (err) {
      console.error("Failed to create effect", err);
    }
  };

  const handleConfirmPlay = async (play: boolean) => {
    if (!confirmPlay) return;
    const target = confirmPlay;
    setConfirmPlay(null);
    if (!play) return;
    try {
      await effectApi.updateEffectStatus([target.uuid], "Play");
      fetchAll();
    } catch (err) { console.error("Failed to play new effect", err); }
  };

  const handleEditSave = async (payload: EditEffectPayload) => {
    if (!editing) return;
    const target = editing;
    setEditing(null);
    try {
      let settingsUuid: string;
      if (payload.preset.kind === "new") {
        settingsUuid = await effectSettingsApi.createEffectSettings(payload.preset.mutation);
      } else {
        settingsUuid = payload.preset.settingsUuid;
        if (payload.preset.mutation) {
          await effectSettingsApi.updateEffectSettings(settingsUuid, payload.preset.mutation);
        }
      }
      // Moving a pool-assigned effect onto a strip means clearing its pool too,
      // since the API enforces exactly one of stripUuid/poolUuid.
      const movedFromPoolToStrip = Boolean(target.poolUuid && payload.effect.stripUuid);
      const nextPoolUuid = movedFromPoolToStrip ? null : target.poolUuid ?? null;
      setEffects((prev) =>
        prev.map((e) =>
          e.uuid === target.uuid
            ? {
                ...e,
                name: payload.effect.name,
                paletteUuid: payload.effect.paletteUuid,
                stripUuid: payload.effect.stripUuid,
                poolUuid: nextPoolUuid,
                settingsUuid,
              }
            : e,
        ),
      );
      await effectApi.updateEffect(target.uuid, {
        name: payload.effect.name,
        effectType: target.type,
        settingsUuid,
        paletteUuid: payload.effect.paletteUuid,
        stripUuid: payload.effect.stripUuid,
        ...(movedFromPoolToStrip ? { poolUuid: null } : {}),
      });
      fetchAll();
    } catch (err) {
      console.error("Failed to update effect", err);
      fetchAll();
    }
  };

  const handleActivateEffect = async (effect: ILightEffect) => {
    const base = activeEffects[0];
    const statusToCmd: Record<LightEffectStatus, LightEffectStatusCommand> = {
      [LightEffectStatus.Playing]: "Play",
      [LightEffectStatus.Paused]: "Pause",
      [LightEffectStatus.Stopped]: "Stop",
      [LightEffectStatus.Inactive]: "Play",
    };
    const cmd: LightEffectStatusCommand = base ? statusToCmd[base.status] : "Play";
    try {
      await effectApi.updateEffectStatus([effect.uuid], cmd);
      fetchAll();
    } catch (err) {
      console.error("Failed to activate effect", err);
    }
  };

  const handleDeactivateEffect = async (effect: ILightEffect) => {
    try {
      await effectApi.updateEffectStatus([effect.uuid], "Deactivate");
      fetchAll();
    } catch (err) {
      console.error("Failed to deactivate effect", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleting) return;
    const target = deleting;
    setDeleting(null);
    try {
      await effectApi.deleteEffect(target.uuid);
      fetchAll();
    } catch (err) {
      console.error("Failed to delete effect", err);
    }
  };

  const selectStrip = (uuid: string) => { setSelectedId(uuid); setMobilePane("main"); };

  /* ─────────────────────────── Sidebar ─────────────────────────── */
  const noPoolsTooltip = pools.length === 0;
  const sidebar = (
    <Stack gap={0} style={{ flex: 1, minHeight: 0 }}>
      <Group gap={0} px="xs" style={{ borderBottom: "1px solid var(--mantine-color-default-border)", flexShrink: 0 }}>
        {(["strips", "pools"] as SidebarTab[]).map((t) => {
          const disabled = t === "pools" && noPoolsTooltip;
          const tabBtn = (
            <UnstyledButton
              key={t}
              data-testid={`eff-tab-${t}`}
              onClick={() => { if (!disabled) setTab(t); }}
              style={{
                padding: "8px 12px",
                marginBottom: -1,
                background: "transparent",
                borderBottom: `2px solid ${tab === t ? "var(--neon-accent)" : "transparent"}`,
                color: tab === t ? "var(--neon-accent)" : "var(--neon-text3)",
                fontFamily: "var(--mantine-font-family-monospace)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
            >
              {t}
            </UnstyledButton>
          );
          return disabled ? (
            <Tooltip key={t} label="No pools configured" openDelay={150}>{tabBtn}</Tooltip>
          ) : tabBtn;
        })}
      </Group>

      <Box style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 8 }}>
        {tab === "strips" ? (
          loading ? (
            <Stack gap={6}>{[0, 1, 2].map((i) => (<Skeleton key={i} height={62} radius="sm" />))}</Stack>
          ) : strips.length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="md">No strips configured</Text>
          ) : (
            <Stack gap={6}>
              {sortedStrips.map((s) => {
                const own = effectsByStrip.get(s.uuid) ?? [];
                const playState = playStateFromOwn(own);
                const stripActive = own
                  .filter((e) => e.status !== LightEffectStatus.Inactive)
                  .sort((a, b) => a.layer - b.layer);
                const baseLayer = stripActive[0];
                const palette = baseLayer?.paletteUuid ? paletteByUuid.get(baseLayer.paletteUuid) : undefined;
                return (
                  <StripCard
                    key={s.uuid}
                    strip={s}
                    online={onlineByStrip[s.uuid] !== false}
                    connected={connectedByStrip[s.uuid] === true}
                    playState={playState}
                    activeEffect={baseLayer}
                    activeSettings={presetForEffect(baseLayer)}
                    activeEffectCount={stripActive.length}
                    palette={palette}
                    selected={selectedId === s.uuid}
                    onSelect={selectStrip}
                    onUpdatePlayState={(cmd) => handleStripPlayState(s, cmd)}
                    onUpdateBrightness={(b) => handleBrightnessChange(s, b)}
                    onCommitBrightness={(b) => commitBrightness({ ...s, brightness: b })}
                  />
                );
              })}
            </Stack>
          )
        ) : (
          pools.length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="md">No pools configured</Text>
          ) : (
            <Stack gap={6}>
              {sortedPools.map((p) => {
                const own = effectsByPool.get(p.uuid) ?? [];
                const playState = playStateFromOwn(own);
                const active = own.find(
                  (e) => e.status === LightEffectStatus.Playing || e.status === LightEffectStatus.Paused,
                );
                const activeSettings = (presetForEffect(active)?.settings ?? {}) as { color?: string };
                return (
                  <PoolCard
                    key={p.uuid}
                    pool={p}
                    strips={strips}
                    playState={playState}
                    onlineByStrip={onlineByStrip}
                    selected={selectedId === p.uuid}
                    variant="effects"
                    onSelect={selectStrip}
                    onUpdatePlayState={(cmd) => handlePoolPlayState(p, cmd)}
                    activeEffectType={active?.type ?? null}
                    activeColor={activeSettings.color ?? null}
                  />
                );
              })}
            </Stack>
          )
        )}
      </Box>
    </Stack>
  );

  /* ─────────────────────────── Main / catalog ─────────────────────────── */
  const canAdd = Boolean(selectedStrip || selectedPool);

  const main = (
    <Stack gap={0} style={{ flex: 1, minHeight: 0, position: "relative" }}>
      <Group
        px="md"
        py="sm"
        gap="sm"
        wrap="nowrap"
        style={{
          borderBottom: "1px solid var(--mantine-color-default-border)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {isMobile && (
          <UnstyledButton
            data-testid="eff-back"
            onClick={() => setMobilePane("sidebar")}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", display: "inline-flex", alignItems: "center", gap: 4, color: "var(--neon-text3)", fontFamily: "var(--mantine-font-family-monospace)", fontSize: 10 }}
          >
            <CaretLeftIcon size={12} /> Back
          </UnstyledButton>
        )}
        <Group gap="sm" wrap="nowrap" style={{ flex: 1, justifyContent: isMobile ? "center" : "flex-start", minWidth: 0 }}>
          <Text ff="var(--mantine-font-family-monospace)" size="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: "0.06em" }}>
            Effects {selectedName && (
              <>
                — <Text component="span" ff="var(--mantine-font-family-sans)" size="sm" c="var(--mantine-color-text)" tt="none" fw={500}>{selectedName}</Text>
              </>
            )}
          </Text>
        </Group>
        {!isMobile && (
          <Tooltip label="Select a strip or pool first" disabled={canAdd} openDelay={150}>
            <Button
              data-testid="eff-add-effect-btn"
              leftSection={<PlusIcon size={12} />}
              disabled={!canAdd}
              onClick={() => setAddOpen(true)}
            >
              Add Effect
            </Button>
          </Tooltip>
        )}
      </Group>

      <Box style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "10px 14px 80px" }}>
        {!selectedId ? (
          <Text
            size="xs"
            c="dimmed"
            ta="center"
            py="xl"
            ff="var(--mantine-font-family-monospace)"
            style={{ letterSpacing: "0.06em" }}
          >
            SELECT A STRIP OR POOL
          </Text>
        ) : selectedEffects.length === 0 ? (
          <EmptyState
            title="No effects"
            subtitle={selectedName ? `Add an effect to make ${selectedName} glow.` : undefined}
            action={
              <Button
                data-testid="eff-empty-add"
                size="xs"
                variant="default"
                leftSection={<PlusIcon size={12} />}
                onClick={() => setAddOpen(true)}
                mt="sm"
              >
                Add Effect
              </Button>
            }
          />
        ) : (
          <Stack gap={5}>
            <Group
              gap={10}
              wrap="nowrap"
              px={10}
              style={{
                fontFamily: "var(--mantine-font-family-monospace)",
                fontSize: 9,
                color: "var(--neon-text3)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                paddingTop: 4,
                paddingBottom: 4,
              }}
            >
              <Box style={{ width: 34, flexShrink: 0 }} />
              <Box style={{ flex: 1 }}>Effect</Box>
              <Box style={{ width: 70, textAlign: "right", flexShrink: 0 }}>Layer</Box>
              <Box style={{ width: 24, flexShrink: 0 }} />
            </Group>
            {activeEffects.map((eff) => {
              const palette = eff.paletteUuid ? paletteByUuid.get(eff.paletteUuid) : undefined;
              return (
                <EffectListRow
                  key={eff.uuid}
                  effect={eff}
                  settings={presetForEffect(eff)}
                  palette={palette}
                  onEdit={() => setEditing(eff)}
                  onDelete={() => setDeleting(eff)}
                  onDeactivate={() => handleDeactivateEffect(eff)}
                />
              );
            })}
            {inactiveEffects.length > 0 && (
              <>
                <Text
                  ff="var(--mantine-font-family-monospace)"
                  size="xs"
                  c="var(--neon-text3)"
                  tt="uppercase"
                  style={{ letterSpacing: "0.08em", fontSize: 9, paddingTop: 12, paddingBottom: 2, paddingLeft: 10 }}
                  data-testid="eff-inactive-label"
                >
                  Inactive
                </Text>
                {inactiveEffects.map((eff) => {
                  const palette = eff.paletteUuid ? paletteByUuid.get(eff.paletteUuid) : undefined;
                  return (
                    <EffectListRow
                      key={eff.uuid}
                      effect={eff}
                      settings={presetForEffect(eff)}
                      palette={palette}
                      onEdit={() => setEditing(eff)}
                      onDelete={() => setDeleting(eff)}
                      onActivate={() => handleActivateEffect(eff)}
                    />
                  );
                })}
              </>
            )}
          </Stack>
        )}
      </Box>

      {isMobile && canAdd && (
        <ActionIcon
          data-testid="eff-add-effect-fab"
          onClick={() => setAddOpen(true)}
          size={54}
          radius="xl"
          variant="filled"
          aria-label="Add effect"
          style={{
            position: "absolute",
            right: 18,
            bottom: 18,
            boxShadow: "0 6px 24px var(--neon-accent-glow), 0 2px 8px rgba(0,0,0,.3)",
            zIndex: 5,
          }}
        >
          <PlusIcon size={24} weight="bold" />
        </ActionIcon>
      )}
    </Stack>
  );

  const modals = (
    <>
      <AddEffectModal
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreateEffect}
        palettes={palettes}
        presets={presets}
        isMobile={isMobile}
        targetName={selectedName}
      />
      {editing && (
        <EditEffectModal
          effect={editing}
          strips={strips}
          palettes={palettes}
          presets={presets}
          isMobile={isMobile}
          onClose={() => setEditing(null)}
          onSave={handleEditSave}
        />
      )}
      <ConfirmDeleteModal
        opened={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deleting?.name ?? "this effect"}
        title="Delete effect"
      />
      <Modal
        opened={Boolean(confirmPlay)}
        onClose={() => setConfirmPlay(null)}
        title="Play effect?"
        radius="md"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Play <strong>{confirmPlay?.name}</strong>
            {selectedName && (
              <>
                {" "}on <strong>{selectedName}</strong>
              </>
            )}
            ?
          </Text>
          <Text size="xs" c="dimmed">
            The effect was saved. You can play it now, or leave it idle and start it later.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => handleConfirmPlay(false)} data-testid="confirm-play-no">
              No, just save
            </Button>
            <Button
              leftSection={<PlayIcon size={12} weight="fill" />}
              onClick={() => handleConfirmPlay(true)}
              data-testid="confirm-play-yes"
            >
              Play{selectedName ? ` on ${selectedName}` : ""}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );

  /* ─────────────────────────── Layout ─────────────────────────── */
  if (isMobile) {
    return (
      <>
        <Box style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {mobilePane === "sidebar" ? sidebar : main}
        </Box>
        {modals}
      </>
    );
  }

  return (
    <>
      <Box style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
        <Box
          style={{
            width: 280,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderRight: "1px solid var(--mantine-color-default-border)",
            background: "var(--neon-bg2)",
          }}
        >
          {sidebar}
        </Box>
        <Box
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {main}
        </Box>
      </Box>
      {modals}
    </>
  );
}

export default EffectsSplitPane;
