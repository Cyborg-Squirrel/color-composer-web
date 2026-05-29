import { Skeleton, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CpuIcon, PlusIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { useResourceEvents } from "~/provider/EventStreamContext";
import { applyEventToList, eventTouches } from "~/api/events/events_api";
import { useClientApi } from "~/provider/ClientApiContext";
import { useStripApi } from "~/provider/StripApiContext";
import { isMobileUi } from "~/components/util/IsMobile";
import { ConfirmDeleteModal } from "~/components/util/ConfirmDeleteModal";
import { EmptyState } from "~/components/util/EmptyState";
import ClientCard from "./ClientCard";
import ClientFormModal from "./ClientFormModal";
import AddClientButton from "./AddClientButton";

interface ClientListProps {
  refreshKey: number;
  onClientChanged: () => void;
}

export function ClientList({ refreshKey, onClientChanged }: ClientListProps) {
  const clientApi = useClientApi();
  const stripApi = useStripApi();
  const isMobile = isMobileUi();
  const [clients, setClients] = useState<ILedStripClient[] | undefined>(undefined);
  const [strips, setStrips] = useState<ILedStrip[]>([]);
  const [editUuid, setEditUuid] = useState<string>("");
  const [modalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleting, setDeleting] = useState<ILedStripClient | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const location = useLocation();

  const fetchAll = useCallback(async () => {
    setClients(undefined);
    try {
      const [c, s] = await Promise.all([clientApi.getClients(), stripApi.getStrips()]);
      setClients(c);
      setStrips(s);
    } catch (err) {
      console.error("Failed to load clients", err);
      setClients([]);
    }
  }, [clientApi, stripApi]);

  useEffect(() => { fetchAll(); }, [fetchAll, refreshKey]);

  // Apply server events to the in-memory lists instead of refetching.
  useResourceEvents(
    ["LedClient", "LedStrip"],
    (event) => {
      if (eventTouches(event, "LedClient")) {
        setClients((prev) => (prev ? applyEventToList(prev, event) : prev));
      } else {
        setStrips((prev) => applyEventToList(prev, event));
      }
    },
    [],
  );

  // Open edit modal when navigated from Home with state.openClientUuid.
  useEffect(() => {
    const uuid = (location.state as { openClientUuid?: string } | null)?.openClientUuid;
    if (uuid && clients && clients.some((c) => c.uuid === uuid)) {
      setEditUuid(uuid);
      openModal();
      window.history.replaceState({}, "");
    }
  }, [clients, location.state, openModal]);

  const handleEditSuccess = () => {
    closeModal();
    onClientChanged();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await clientApi.deleteClient(deleting.uuid);
      setDeleting(null);
      onClientChanged();
    } catch (err) {
      console.error("Failed to delete client", err);
    } finally {
      setDeleteBusy(false);
    }
  };

  const stripCount = (uuid: string) => strips.filter((s) => s.clientUuid === uuid).length;

  if (clients === undefined) {
    return (
      <Stack gap="sm">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height={68} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<CpuIcon size={28} weight="duotone" />}
        title="No clients"
        subtitle="Add your first Raspberry Pi or Night Driver to get started"
        action={<AddClientButton onSuccess={onClientChanged} />}
      />
    );
  }

  return (
    <>
      <ClientFormModal
        opened={modalOpen}
        onClose={closeModal}
        onSuccess={handleEditSuccess}
        isMobile={isMobile}
        client={clients.find((c) => c.uuid === editUuid)}
        strips={strips}
        title="Edit Client"
      />
      <ConfirmDeleteModal
        opened={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        itemName={deleting?.name ?? ""}
        busy={deleteBusy}
      />
      <Stack gap="sm">
        {clients.map((c) => (
          <ClientCard
            key={c.uuid}
            client={c}
            stripCount={stripCount(c.uuid)}
            onClick={() => { setEditUuid(c.uuid); openModal(); }}
            onDelete={() => setDeleting(c)}
          />
        ))}
      </Stack>
    </>
  );
}

export default ClientList;
