import { Button, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { buildOnlineByStrip } from "~/components/util/stripHelpers";
import { useClientApi } from "~/provider/ClientApiContext";
import { usePoolApi } from "~/provider/PoolApiContext";
import { useStripApi } from "~/provider/StripApiContext";
import NewPoolModal from "./NewPoolModal";

interface NewPoolButtonProps {
  onSuccess?: () => void;
}

export function NewPoolButton({ onSuccess }: NewPoolButtonProps) {
  const stripApi = useStripApi();
  const clientApi = useClientApi();
  const poolApi = usePoolApi();
  const isMobile = isMobileUi();
  const [opened, { open, close }] = useDisclosure(false);
  const [strips, setStrips] = useState<ILedStrip[]>([]);
  const [clients, setClients] = useState<ILedStripClient[]>([]);

  // Lazy-load strips and clients when the modal opens, so we always show fresh data.
  useEffect(() => {
    if (!opened) return;
    let cancelled = false;
    Promise.all([stripApi.getStrips(), clientApi.getClients()]).then(([s, c]) => {
      if (cancelled) return;
      setStrips(s);
      setClients(c);
    }).catch((err) => console.error("Failed to load strips/clients for pool modal", err));
    return () => { cancelled = true; };
  }, [opened, stripApi, clientApi]);

  const onlineByStrip = buildOnlineByStrip(strips, clients);
  const eligibleCount = Object.values(onlineByStrip).filter(Boolean).length;
  const noEligible = eligibleCount < 2 && opened;

  const handleCreate = async ({ name, poolType, members }: { name: string; poolType: "Sync" | "Unified"; members: { stripUuid: string; inverted: boolean; poolIndex: number }[] }) => {
    try {
      const uuid = await poolApi.createPool({ name, poolType });
      await poolApi.updatePoolMembers(uuid, members);
      close();
      onSuccess?.();
    } catch (err) {
      console.error("Failed to create pool", err);
    }
  };

  return (
    <>
      <NewPoolModal
        opened={opened}
        onClose={close}
        strips={strips}
        onlineByStrip={onlineByStrip}
        onCreate={handleCreate}
        isMobile={isMobile}
      />
      <Tooltip
        label="Need at least 2 online strips"
        disabled={!noEligible}
      >
        <Button
          data-testid="new-pool-btn"
          leftSection={<PlusIcon size={12} />}
          onClick={open}
        >
          New Pool
        </Button>
      </Tooltip>
    </>
  );
}

export default NewPoolButton;
