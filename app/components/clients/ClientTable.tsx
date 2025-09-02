import { Button, Center, Menu, Table } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { IsMobileContext } from "../../context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { statusColors } from "../status";

interface IClientTableProps {}

export function ClientTable(props: IClientTableProps) {
    const isMobile = useContext(IsMobileContext);
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
            {isMobile ? null : <Table.Td>{c.clientType}</Table.Td>}
            <Table.Td>{isMobile ? getShortAddress(c) : c.address}</Table.Td>
            <Table.Td c={statusColors.ok}>Idle</Table.Td>
            <Table.Td>
                <Menu shadow="md" width="8em" position="bottom-end" closeOnItemClick>
                    <Menu.Target>
                        <Button variant="subtle" size="xs" color="var(--mantine-color-text)">...</Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item>Edit</Menu.Item>
                        <Menu.Item>Delete</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="xs" highlightOnHover={!isMobile}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    {isMobile ? null : <Table.Th>Type</Table.Th>}
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

function getShortAddress(client: ILedStripClient): string {
    const MAX_ADDRESS_LENGTH = 15
    const ELIPSES_LENGTH = 3
    let addressWithSchemeRemoved = client.address.replace(/^https?:\/\//, "");
    if (addressWithSchemeRemoved.length > MAX_ADDRESS_LENGTH) {
        return addressWithSchemeRemoved.substring(0, MAX_ADDRESS_LENGTH - ELIPSES_LENGTH) + '...';
    } else {
        return addressWithSchemeRemoved;
    }
}