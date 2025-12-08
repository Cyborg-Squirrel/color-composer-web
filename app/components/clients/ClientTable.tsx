import { Center, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { ClientStatus, getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "~/context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../TextHelper";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";
import ClientForm from "./ClientForm";

function ClientTable() {
    const isLightMode = useContext(IsLightModeContext);
    const isMobile = useContext(IsMobileContext);
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [selectedClientUuid, setClientUuid] = useState<string>("");
    const [drawerOpened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const [strips, clients] = await Promise.all([
                    getStrips(),
                    getClients()
                ]);
                setStrips(strips);
                setClients(clients.sort((a, b) =>
                    getClientStatusPrecedence(a.status) >= getClientStatusPrecedence(b.status) ? 1 : -1));
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) {
        return <BoundedLoadingOverlay loading />;
    } else if (error) {
        console.log('Showing error ' + error);
        return <Center>
            <div>
                Error fetching clients
            </div>
        </Center>;
    }

    const dataRows = clients.map(c => ({
        name: c.name,
        uuid: c.uuid,
        status: c.status == ClientStatus.Offline ? 'Offline since ' + getLastSeenAtString(c.lastSeenAt) : getClientStatusText(c.status),
        statusColor: getClientStatusColor(c.status, isLightMode),
        secondColString: c.address,
        thirdColString: c.clientType,
    }));

    return (<>
        <Modal radius="md" size="lg" fullScreen={isMobile} opened={drawerOpened}
            onClose={close} closeButtonProps={{ size: 'lg' }} title='Edit Client'>
            <ClientForm client={clients.find(c => c.uuid == selectedClientUuid)} strips={strips} isMobile={isMobile} onSubmit={close} />
        </Modal>
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