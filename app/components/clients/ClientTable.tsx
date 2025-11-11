import { Button, Center, Menu, Table, Text } from "@mantine/core";
import { useContext, useEffect, useState, type ReactNode } from "react";
import { ClientStatus, getClients, type ILedStripClient } from "~/api/clients_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "../../context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getLastSeenAtString, getStatusColor, getStatusText } from "../TextHelper";

export function ClientTable() {
    const isMobile = useContext(IsMobileContext);
    const isLightMode = useContext(IsLightModeContext);
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

        return () => { };
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

    const rows = clients.map((c) => (
        <Table.Tr key={c.uuid} onClick={() => onRowClicked(c.uuid, isMobile)}>
            {getClientNameTd(c, c.status, isLightMode)}
            <Table.Td><Text truncate="end">{c.address}</Text></Table.Td>
            {!isMobile && <Table.Td>{c.clientType}</Table.Td>}
            {!isMobile && getEditButtonTd()}
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="xs" highlightOnHover={true}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Address</Table.Th>
                    {!isMobile && <Table.Th>Type</Table.Th>}
                    {!isMobile && <Table.Th />}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    );
}

// TODO: open edit ui if mobile, desktop has the three dot menu
function onRowClicked(clientUuid: string, isMobile: boolean) {
    if (isMobile) {
        console.log("Client clicked:", clientUuid);
    }
}

function getEditButtonTd(): ReactNode {
    return <Table.Td>
        <Menu shadow="md" width="8em" position="bottom-end" closeOnItemClick>
            <Menu.Target>
                <Button variant="subtle" size="xs" color="var(--mantine-color-text)">...</Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item>Edit</Menu.Item>
                <Menu.Item>Delete</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </Table.Td>;
}

function getClientNameTd(client: ILedStripClient, status: ClientStatus, isLightMode: boolean) {
    return <Table.Td>
        <Text>{client.name}</Text>
        {<Text c={getStatusColor(status, isLightMode)} size="sm">{status == ClientStatus.Offline ? 'Offline since: ' + getLastSeenAtString(client.lastSeenAt) : getStatusText(status)}</Text>}
    </Table.Td>;
}