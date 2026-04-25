import { Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ClientStatus, type ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { useClientApi } from "~/provider/ClientApiContext";
import { useStripApi } from "~/provider/StripApiContext";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../util/TextHelper";
import { TableSkeletonRows } from "../util/TableSkeletonRows";
import ClientFormModal from "./ClientFormModal";

interface IClientTableProps {
    onClientChanged?: () => void;
    refreshKey: number;
}

function ClientTable({ onClientChanged, refreshKey }: IClientTableProps) {
    const clientApi = useClientApi();
    const stripsApi = useStripApi();
    const [clients, setClients] = useState<ILedStripClient[] | undefined>(undefined);
    const [strips, setStrips] = useState<ILedStrip[] | undefined>(undefined);
    const isMobile = isMobileUi();
    const [selectedClientUuid, setClientUuid] = useState<string>("");
    const [modalOpened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        setClients(undefined);
        setStrips(undefined);
        Promise.all([clientApi.getClients(), stripsApi.getStrips()])
            .then(([fetchedClients, fetchedStrips]) => {
                setClients(fetchedClients);
                setStrips(fetchedStrips);
            })
            .catch(err => {
                console.error('Error fetching data', err);
            });
    }, [refreshKey]);

    const loading = clients === undefined || strips === undefined;

    const handleEditSuccess = () => {
        close();
        onClientChanged?.();
    };

    const sortedClients = loading ? [] : [...clients!].sort((a, b) =>
        getClientStatusPrecedence(a.status) >= getClientStatusPrecedence(b.status) ? 1 : -1);

    return (
        <>
            <ClientFormModal
                opened={modalOpened}
                onClose={close}
                onSuccess={handleEditSuccess}
                isMobile={isMobile}
                client={clients?.find(c => c.uuid === selectedClientUuid)}
                strips={strips ?? []}
                title='Edit Client'
            />
            <Table verticalSpacing="sm" horizontalSpacing="lg" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        {!isMobile && <Table.Th>Address</Table.Th>}
                        {!isMobile && <Table.Th>Type</Table.Th>}
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loading ? (
                        <TableSkeletonRows widths={isMobile ? [140, 100] : [140, 160, 80, 100]} />
                    ) : sortedClients.map(c => (
                        <Table.Tr
                            key={c.uuid}
                            onClick={() => { setClientUuid(c.uuid); open(); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <Table.Td><Text fw={500}>{c.name}</Text></Table.Td>
                            {!isMobile && <Table.Td><Text c="dimmed" size="sm">{c.address}</Text></Table.Td>}
                            {!isMobile && <Table.Td>{c.clientType}</Table.Td>}
                            <Table.Td>
                                <Text size="sm" fw={500} c={getClientStatusColor(c.status)}>
                                    {c.status === ClientStatus.Offline
                                        ? 'Offline since ' + getLastSeenAtString(c.lastSeenAt)
                                        : getClientStatusText(c.status)}
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                    {!loading && sortedClients.length === 0 && (
                        <Table.Tr>
                            <Table.Td colSpan={isMobile ? 2 : 4} ta="center" py="xl" c="dimmed">
                                No clients configured
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </>
    );
}

function getClientStatusPrecedence(status: ClientStatus): number {
    switch (status) {
        case ClientStatus.Error:           return 0;
        case ClientStatus.SetupIncomplete: return 1;
        case ClientStatus.Active:          return 2;
        case ClientStatus.Idle:            return 3;
        case ClientStatus.Offline:         return 4;
        default:                           return 5;
    }
}

export default ClientTable;
