import { Card, Center, Divider, SimpleGrid, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { statusColors } from "../status";

interface IClientGridProps {}

export function ClientGrid(props: IClientGridProps) {
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
        <Card h={250} className='grid-card' style={{padding: '12px'}}>
                <span
                style={{
                    position: "absolute",
                    top: '.667rem',
                    right: '.75rem',
                    width: '1rem',
                    height: '1rem',
                }}>⚙️</span>
                <Text fw={ 700 } span>
                    { c.name }
                </Text>
                <Text c={statusColors.warning} span>
                    Setup incomplete
                </Text>
                <Space h={10}></Space>
                <Divider></Divider>
                <Space h={15}></Space>
                <SpanRow startingText='Address: ' endingText={c.address}></SpanRow>
                <Space h={10}></Space>
                <SpanRow startingText='Type: ' endingText={c.clientType}></SpanRow>
                <Space h={10}></Space>
                <SpanRow startingText='Strips: ' endingText={'1'}></SpanRow>
                <Space h={10}></Space>
                <SpanRow startingText='Active effects: ' endingText={'3'}></SpanRow>
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

function SpanRow(props: {startingText: string, endingText: string}) {
    return <span>
        <Text fw={ 700 } span>{ props.startingText }</Text>
        <Text span>{ props.endingText }</Text>
    </span>
}