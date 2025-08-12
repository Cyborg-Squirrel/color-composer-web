import { Center, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { statusColors } from "../status";

interface IClientTableProps {}

export function ClientTable(props: IClientTableProps) {
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (loading) {
            getClients().then((clientList) => {
                console.log('Received client list ' + clientList);
                setClients(clientList);
                setLoading(false);
            }).catch(() => {
                setError(true);
                setLoading(false);
            });
        }

        return () => {};
    }, []);

    if (loading) {
        console.log('Showing loading overlay');
        return <BoundedLoadingOverlay loading/>;
    } else if (error) {
        console.log('Showing error ' + error);
       return <Center>
            <div>
                Error fetching clients
            </div>
        </Center>
    }
    
    const rows = clients.map((c) => (
        <Table.Tr key={c.uuid}>
            <Table.Td>{c.name}</Table.Td>
            <Table.Td>{c.address}</Table.Td>
            <Table.Td c={statusColors.ok}>Idle</Table.Td>
            <Table.Td>...</Table.Td>
        </Table.Tr>
    ));

    return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th>Status</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                { rows }
            </Table.Tbody>
        </Table>
    );
}