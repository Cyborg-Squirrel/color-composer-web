import { Card, Center, Divider, SimpleGrid, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { statusColors } from "../status";

interface IClientGridProps {}

export function ClientGrid(props: IClientGridProps) {
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (loading) {
            getClients().then((clientList) => {
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
        return <BoundedLoadingOverlay loading/>
    } else if (error) {
        console.log('Showing error ' + error);
       return <Center>
            <div>
                Error fetching clients
            </div>
        </Center>
    }

    const gridItems = clients.map((c) => (
        <Card h={250} bg="var(--mantine-color-body)" style={{padding: '12px'}}>
                <span
                style={{
                    position: "absolute",
                    top: '.667rem',
                    right: '.75rem',
                    width: '1rem',
                    height: '1rem',
                }}>⚙️</span>
                <Text fw={ 700 } span>
                    { clients[0].name }
                </Text>
                <Text c={statusColors.warning} span>
                    Setup incomplete
                </Text>
                <Space h={10}></Space>
                <Divider></Divider>
                <Space h={15}></Space>
                <span><Text fw={ 700 } span>Address: </Text><Text c="dimmed" span>{ c.address }</Text></span>
                <Space h={10}></Space>
                <span><Text fw={ 700 } span>Type: </Text><Text c="dimmed" span>{ c.clientType }</Text></span>
                <Space h={10}></Space>
                <span><Text fw={ 700 } span>Strips: </Text><Text c="dimmed" span>1</Text></span>
                <Space h={10}></Space>
                <span><Text fw={ 700 } span>Playing: </Text><Text c="dimmed" span>3 effects</Text></span>
            </Card>
        ));
    
    return (
        <SimpleGrid
        cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
        spacing={{ base: 10, sm: 'md' }}
        verticalSpacing={{ base: 'md', sm: 'md' }}>
            { gridItems }
        </SimpleGrid>
    );
}