import { Button, Center, Menu, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { statusColors } from "../status";

interface IClientTableProps {}

export function ClientTable(props: IClientTableProps) {
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (loading) {
            getClients().then((clientList) => {
                setClients(clientList);
                setLoading(false);
            }).catch((error) => {
                setError(error);
                setLoading(false);
            });
        }

        return () => {};
    }, []);

    if (loading) {
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
            <Table.Td>
                <Menu shadow="md" width="10em" position="bottom-end">
                    <Menu.Target>
                        <Button variant="subtle" size="xs" c="var(--mantine-color-text)">...</Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Button variant="subtle" size="md" c="var(--mantine-color-text)" justify="left" fullWidth>Edit</Button>
                        <Button variant="subtle" size="md" c="var(--mantine-color-text)" justify="left" fullWidth>Delete</Button>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="xs" striped highlightOnHover withRowBorders={false}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th/>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                { rows }
            </Table.Tbody>
        </Table>
    );
}