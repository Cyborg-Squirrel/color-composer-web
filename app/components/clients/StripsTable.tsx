import { Button, Center, Menu, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";

interface IStripsTableProps {}

export function StripsTable(props: IStripsTableProps) {
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetch() {
            let stripsList = await getStrips();
            let clientList = await getClients();
            setClients(clientList);
            setStrips(stripsList);
        }

        if (loading) {
            fetch().then(() => {
                setLoading(false);
            }).catch(e => {
                setError(error);
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
                Error fetching LED strips
            </div>
        </Center>
    }
    
    const rows = strips.map((s) => (
        <Table.Tr key={s.uuid}>
            <Table.Td>{s.name}</Table.Td>
            <Table.Td>{ clients.find(c => c.uuid == s.clientUuid)?.name }</Table.Td>
            <Table.Td>{s.brightness}%</Table.Td>
            <Table.Td>{s.length}</Table.Td>
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
                    <Table.Th>Client</Table.Th>
                    <Table.Th>Brightness</Table.Th>
                    <Table.Th>LEDs</Table.Th>
                    <Table.Th/>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                { rows }
            </Table.Tbody>
        </Table>
    );
}