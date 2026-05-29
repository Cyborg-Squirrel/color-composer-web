import { Box, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PaletteIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useState } from "react";
import type { IPalette } from "~/api/palettes/palettes_api";
import { usePaletteApi } from "~/provider/PaletteApiContext";
import { useResourceEvents } from "~/provider/EventStreamContext";
import { applyEventToList } from "~/api/events/events_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { ConfirmDeleteModal } from "~/components/util/ConfirmDeleteModal";
import { EmptyState } from "~/components/util/EmptyState";
import AddPaletteButton from "./AddPaletteButton";
import PaletteCard from "./PaletteCard";
import PaletteFormModal from "./PaletteFormModal";

interface PaletteGridProps {
  refreshKey: number;
  onPaletteMutated: () => void;
}

const GRID_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: 12,
};

export function PaletteGrid({ refreshKey, onPaletteMutated }: PaletteGridProps) {
  const paletteApi = usePaletteApi();
  const isMobile = isMobileUi();
  const [palettes, setPalettes] = useState<IPalette[] | undefined>(undefined);
  const [editUuid, setEditUuid] = useState<string>("");
  const [modalOpen, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [deleting, setDeleting] = useState<IPalette | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchAll = useCallback(async () => {
    setPalettes(undefined);
    try {
      setPalettes(await paletteApi.getPalettes());
    } catch (err) {
      console.error("Failed to load palettes", err);
      setPalettes([]);
    }
  }, [paletteApi]);

  useEffect(() => { fetchAll(); }, [fetchAll, refreshKey]);
  useResourceEvents(
    "Palette",
    (event) => setPalettes((prev) => (prev ? applyEventToList(prev, event) : prev)),
    [],
  );

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await paletteApi.deletePalette(deleting.uuid);
      setDeleting(null);
      onPaletteMutated();
    } catch (err) { console.error(err); } finally { setDeleteBusy(false); }
  };

  if (palettes === undefined) {
    return (
      <Box style={GRID_STYLE}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} height={120} radius="sm" />
        ))}
      </Box>
    );
  }

  if (palettes.length === 0) {
    return (
      <EmptyState
        icon={<PaletteIcon size={28} weight="duotone" />}
        title="No palettes"
        subtitle="Create a palette to reuse color sets across effects"
        action={<AddPaletteButton onSuccess={onPaletteMutated} />}
      />
    );
  }

  return (
    <>
      <PaletteFormModal
        opened={modalOpen}
        onClose={closeModal}
        onSuccess={() => { closeModal(); onPaletteMutated(); }}
        isMobile={isMobile}
        palette={palettes.find((p) => p.uuid === editUuid)}
        title="Edit Palette"
      />
      <ConfirmDeleteModal
        opened={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        itemName={deleting?.name ?? ""}
        busy={deleteBusy}
      />
      <Box style={GRID_STYLE}>
        {palettes.map((p) => (
          <PaletteCard
            key={p.uuid}
            palette={p}
            onClick={() => { setEditUuid(p.uuid); openModal(); }}
            onDelete={() => setDeleting(p)}
          />
        ))}
      </Box>
    </>
  );
}

export default PaletteGrid;
