import { Skeleton, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LightbulbIcon, StackIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { IStripPool } from "~/api/pools/pools_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { ConfirmDeleteModal } from "~/components/util/ConfirmDeleteModal";
import { EmptyState } from "~/components/util/EmptyState";
import { isMobileUi } from "~/components/util/IsMobile";
import {
  buildOnlineByStrip,
  comparePoolsActiveFirst,
  compareStripsActiveFirst,
} from "~/components/util/stripHelpers";
import { useClientApi } from "~/provider/ClientApiContext";
import { useResourceEvents } from "~/provider/EventStreamContext";
import { usePoolApi } from "~/provider/PoolApiContext";
import { useStripApi } from "~/provider/StripApiContext";
import PoolCard from "./PoolCard";
import StripFormModal from "./StripFormModal";
import StripListCard from "./StripListCard";

export type StripListTab = "strips" | "pools";

interface StripListProps {
  refreshKey: number;
  onChanged: () => void;
  tab: StripListTab;
}

export function StripList({ refreshKey, onChanged, tab }: StripListProps) {
  const stripApi = useStripApi();
  const clientApi = useClientApi();
  const poolApi = usePoolApi();
  const isMobile = isMobileUi();
  const location = useLocation();

  const [strips, setStrips] = useState<ILedStrip[] | undefined>(undefined);
  const [clients, setClients] = useState<ILedStripClient[]>([]);
  const [pools, setPools] = useState<IStripPool[]>([]);

  const [editStripUuid, setEditStripUuid] = useState<string>("");
  const [stripModalOpen, { open: openStripModal, close: closeStripModal }] = useDisclosure(false);
  const [deletingStrip, setDeletingStrip] = useState<ILedStrip | null>(null);
  const [deletingPool, setDeletingPool] = useState<IStripPool | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchAll = useCallback(async () => {
    setStrips(undefined);
    try {
      const [s, p, c] = await Promise.all([
        stripApi.getStrips(),
        poolApi.getPools(),
        clientApi.getClients(),
      ]);
      setStrips(s);
      setClients(c);
      setPools(p);
    } catch (err) {
      console.error("Failed to load strips/pools", err);
      setStrips([]);
    }
  }, [stripApi, clientApi, poolApi]);

  useEffect(() => { fetchAll(); }, [fetchAll, refreshKey]);
  useResourceEvents(
    ["LedStrip", "LedClient", "StripPool", "LightEffect", "Palette"],
    () => { fetchAll(); },
    [],
  );

  const onlineByStrip = useMemo(() => buildOnlineByStrip(strips ?? [], clients), [strips, clients]);

  const stripInPool = useMemo(() => {
    const set = new Set<string>();
    for (const p of pools) for (const m of p.members) set.add(m.stripUuid);
    return set;
  }, [pools]);

  const sortedStrips = useMemo(
    () => strips ? [...strips].sort(compareStripsActiveFirst) : undefined,
    [strips],
  );
  const sortedPools = useMemo(
    () => [...pools].sort(comparePoolsActiveFirst),
    [pools],
  );

  useEffect(() => {
    const uuid = (location.state as { openStripUuid?: string } | null)?.openStripUuid;
    if (uuid && strips && strips.some((s) => s.uuid === uuid)) {
      setEditStripUuid(uuid);
      openStripModal();
      window.history.replaceState({}, "");
    }
  }, [strips, location.state, openStripModal]);

  const confirmDeleteStrip = async () => {
    if (!deletingStrip) return;
    setDeleteBusy(true);
    try {
      await stripApi.deleteStrip(deletingStrip.uuid);
      setDeletingStrip(null);
      onChanged();
    } catch (err) { console.error(err); } finally { setDeleteBusy(false); }
  };

  const confirmDeletePool = async () => {
    if (!deletingPool) return;
    setDeleteBusy(true);
    try {
      await poolApi.deletePool(deletingPool.uuid);
      setDeletingPool(null);
      onChanged();
    } catch (err) { console.error(err); } finally { setDeleteBusy(false); }
  };

  return (
    <>
      <StripFormModal
        opened={stripModalOpen}
        onClose={closeStripModal}
        isMobile={isMobile}
        strip={strips?.find((s) => s.uuid === editStripUuid)}
        clients={clients}
        title="Edit Strip"
        onSuccess={() => { closeStripModal(); onChanged(); }}
      />
      <ConfirmDeleteModal
        opened={Boolean(deletingStrip)}
        onClose={() => setDeletingStrip(null)}
        onConfirm={confirmDeleteStrip}
        itemName={deletingStrip?.name ?? ""}
        busy={deleteBusy}
      />
      <ConfirmDeleteModal
        opened={Boolean(deletingPool)}
        onClose={() => setDeletingPool(null)}
        onConfirm={confirmDeletePool}
        itemName={deletingPool?.name ?? ""}
        busy={deleteBusy}
      />

      {tab === "strips" ? (
        sortedStrips === undefined ? (
          <Stack gap="sm">
            {[0, 1, 2].map((i) => (<Skeleton key={i} height={92} radius="sm" />))}
          </Stack>
        ) : sortedStrips.length === 0 ? (
          <EmptyState
            icon={<LightbulbIcon size={28} weight="duotone" />}
            title="No strips"
            subtitle="Add a strip attached to one of your clients"
          />
        ) : (
          <Stack gap="sm">
            {sortedStrips.map((s) => {
              const playState = s.inUse ? "playing" : "stopped";
              return (
                <StripListCard
                  key={s.uuid}
                  strip={s}
                  online={onlineByStrip[s.uuid] !== false}
                  playState={playState}
                  clientName={clients.find((c) => c.uuid === s.clientUuid)?.name ?? "—"}
                  isInPool={stripInPool.has(s.uuid)}
                  onClick={() => { setEditStripUuid(s.uuid); openStripModal(); }}
                  onDelete={() => setDeletingStrip(s)}
                />
              );
            })}
          </Stack>
        )
      ) : (
        sortedPools.length === 0 ? (
          <EmptyState
            icon={<StackIcon size={28} weight="duotone" />}
            title="No pools"
            subtitle="Group strips so they play one effect in sync"
          />
        ) : (
          <Stack gap="sm">
            {sortedPools.map((p) => {
              const playState = p.inUse ? "playing" : "stopped";
              return (
                <PoolCard
                  key={p.uuid}
                  pool={p}
                  strips={strips ?? []}
                  playState={playState}
                  onlineByStrip={onlineByStrip}
                  variant="strips"
                />
              );
            })}
          </Stack>
        )
      )}
    </>
  );
}

export default StripList;
