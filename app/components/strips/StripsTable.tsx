import { Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { useStripApi } from "~/provider/StripApiContext";
import { getStripStatusColor, getStripStatusText } from "../util/TextHelper";
import { TableSkeletonRows } from "../util/TableSkeletonRows";
import StripFormModal from "./StripFormModal";

interface IStripsTableProps {
    clients: ILedStripClient[] | undefined;
    refreshKey: number;
    onClientChanged: () => void;
}

export function StripsTable({ clients, refreshKey, onClientChanged }: IStripsTableProps) {
    const stripApi = useStripApi();
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStripUuid, setStripUuid] = useState<string>("");
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = isMobileUi();

    const fetchStrips = useCallback(async () => {
        try {
            setLoading(true);
            setStrips(await stripApi.getStrips());
        } finally {
            setLoading(false);
        }
    }, [stripApi]);

    useEffect(() => {
        fetchStrips();
    }, [refreshKey]);

    const isLoading = loading || clients === undefined;

    const handleEditSuccess = () => {
        close();
        onClientChanged();
    };

    return (
        <>
            <StripFormModal
                opened={modalOpened}
                onClose={close}
                isMobile={isMobile}
                strip={strips.find(s => s.uuid === selectedStripUuid)}
                clients={clients}
                title='Edit Strip'
                onSuccess={handleEditSuccess}
            />
            <Table verticalSpacing="sm" horizontalSpacing="lg" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        {!isMobile && <Table.Th>Client</Table.Th>}
                        <Table.Th>Length</Table.Th>
                        <Table.Th>Brightness</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {isLoading ? (
                        <TableSkeletonRows widths={isMobile ? [140, 60, 60, 80] : [140, 100, 60, 60, 80]} />
                    ) : strips.map(s => {
                        const clientName = clients!.find(c => c.uuid === s.clientUuid)?.name ?? '—';
                        return (
                            <Table.Tr
                                key={s.uuid}
                                onClick={() => { setStripUuid(s.uuid); open(); }}
                                style={{ cursor: 'pointer' }}
                            >
                                <Table.Td><Text fw={500}>{s.name}</Text></Table.Td>
                                {!isMobile && <Table.Td>{clientName}</Table.Td>}
                                <Table.Td>{s.length}</Table.Td>
                                <Table.Td>{s.brightness}%</Table.Td>
                                <Table.Td>
                                    <Text size="sm" fw={500} c={getStripStatusColor(s.activeEffects)}>
                                        {getStripStatusText(s.activeEffects)}
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        );
                    })}
                    {!isLoading && strips.length === 0 && (
                        <Table.Tr>
                            <Table.Td colSpan={isMobile ? 4 : 5} ta="center" py="xl" c="dimmed">
                                No strips configured
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </>
    );
}
