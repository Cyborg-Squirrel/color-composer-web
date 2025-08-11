import { Box, Card, Center, LoadingOverlay, SimpleGrid, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";

interface IClientGridProps {}

const statusColors = {
    error: 'red',
    warning: 'yellow',
    ok: 'green',
    disconnected: 'gray'
};

export function ClientGrid(props: IClientGridProps) {
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
        console.log('Showing loading overlay')
        return <Box
        style={{
            backgroundColor: 'transparent',
            position: 'relative',
            overflow: 'visible',
            padding: 20,
            minHeight: 300,
        }}
        >
            <LoadingOverlay visible={ loading } zIndex={ 1000 } overlayProps={{ backgroundOpacity:0 }} loaderProps={{ type: 'bars' }} />
            </Box>;
    } else if (error) {
        console.log('Showing error ' + error);
       return <Center>
            <div>
                Error fetching clients
            </div>
        </Center>
    }
    
    return (
        <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: 10, sm: 'md' }}
        verticalSpacing={{ base: 'md', sm: 'md' }}>
            <Card
            h={250}
            bg="var(--mantine-color-body)"
            style={{padding: '12px'}}
            >
                <span
                style={{
                    position: "absolute",
                    top: '1rem',
                    right: '1rem',
                    width: '1rem',
                    height: '1rem',
                    borderRadius: "50%",
                    backgroundColor: statusColors.warning,
                }}/>
                <h3>
                    { clients[0].name }
                </h3>
            </Card>
            <Stack
            h={250}
            bg="var(--mantine-color-body)"
            align="stretch"
            gap="md"
            >
            </Stack>
            <Stack
            h={250}
            bg="var(--mantine-color-body)"
            align="stretch"
            gap="md"
            >
            </Stack>
            <Stack
            h={250}
            bg="var(--mantine-color-body)"
            align="stretch"
            gap="md"
            >
            </Stack>
        </SimpleGrid>
    );
}