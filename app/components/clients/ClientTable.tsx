import { Button, Center, Menu, Table, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "../../context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getLastSeenAtString } from "../LastSeenAt";
import { statusColors } from "../status";

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
            {getClientNameTd(c, isMobile, isLightMode)}
            <Table.Td><Text truncate="end">{c.address}</Text></Table.Td>
            {isMobile ? null : <Table.Td>{c.clientType}</Table.Td>}
            <Table.Td c={statusColors.ok}>Idle</Table.Td>
            {getEditButtonTd(isMobile)}
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="xs" highlightOnHover={true}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Address</Table.Th>
                    {isMobile ? null : <Table.Th>Type</Table.Th>}
                    <Table.Th>Status</Table.Th>
                    {isMobile ? null : <Table.Th />}
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

function getEditButtonTd(isMobile: boolean) {
    if (isMobile) {
        return null;
    } else {
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
}

function getClientNameTd(client: ILedStripClient, isMobile: boolean, isLightMode: boolean) {
    return <Table.Td>
        <Text>{client.name}</Text>
        <Text c={isLightMode ? undefined : "dimmed"} size="sm">Last seen: {getLastSeenAtString(client.lastSeenAt)}</Text>
    </Table.Td>;
}