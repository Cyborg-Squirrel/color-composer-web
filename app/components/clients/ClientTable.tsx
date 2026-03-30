import { Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useState } from "react";
import { ClientStatus, type ILedStripClient } from "~/api/clients_api";
import type { ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "~/context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../TextHelper";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";
import ClientFormModal from "./ClientFormModal";

interface IClientTableProps {
    clients: ILedStripClient[] | undefined;
    strips: ILedStrip[] | undefined;
    onClientChanged?: () => void;
}

function ClientTable({ clients, strips, onClientChanged }: IClientTableProps) {
    const isLightMode = useContext(IsLightModeContext);
    const isMobile = useContext(IsMobileContext);
    const [selectedClientUuid, setClientUuid] = useState<string>("");
    const [modalOpened, { open, close }] = useDisclosure(false);

    if (clients === undefined || strips === undefined) {
        return <BoundedLoadingOverlay loading />;
    }

    const handleEditSuccess = () => {
        close();
        onClientChanged?.();
    };

    const sortedClients = [...clients].sort((a, b) =>
        getClientStatusPrecedence(a.status) >= getClientStatusPrecedence(b.status) ? 1 : -1);

    const dataRows = sortedClients.map(c => ({
        name: c.name,
        uuid: c.uuid,
        status: c.status == ClientStatus.Offline ? 'Offline since ' + getLastSeenAtString(c.lastSeenAt) : getClientStatusText(c.status),
        statusColor: getClientStatusColor(c.status, isLightMode),
        secondColString: c.address,
        thirdColString: c.clientType,
    }));

    return (<>
        <ClientFormModal
            opened={modalOpened}
            onClose={close}
            onSuccess={handleEditSuccess}
            isMobile={isMobile}
            client={clients.find(c => c.uuid == selectedClientUuid)}
            strips={strips}
            title='Edit Client'
        />
        <TableWithTrailingButton dataRows={dataRows} dataCols={['Name', 'Address', 'Type']} onClicked={(uuid) => {
            setClientUuid(uuid);
            open();
        }} />
    </>)
}

function getClientStatusPrecedence(status: ClientStatus): number {
    switch (status) {
        case ClientStatus.Error:
            return 0;
        case ClientStatus.Offline:
            return 4;
        case ClientStatus.SetupIncomplete:
            return 1;
        case ClientStatus.Active:
            return 2;
        case ClientStatus.Idle:
            return 3;
        default:
            return 5;
    }
}

export default ClientTable;
