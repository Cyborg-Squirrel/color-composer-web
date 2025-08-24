import { Card, Center, Divider, SimpleGrid, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { ClientStatus, getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { statusColors } from "../status";
import classes from './ClientGrid.module.css';

interface IClientGridProps {}

interface IClientUiModel {
    client: ILedStripClient;
    strips: ILedStrip[];
}

export function ClientGrid(props: IClientGridProps) {
    const [uiModels, setUiModels] = useState<IClientUiModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let promise = Promise.all([getClients(), getStrips()]);
            let result = await promise;
            let models = result[0].map<IClientUiModel>((c) => ({
                client: c,
                strips: result[1].filter((s) => s.clientUuid == c.uuid)
            }));
            setUiModels(models);
        }
        if (loading) {
            fetchData().then(() => {
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

    const gridItems = uiModels.map((m) => (
        <Card key={m.client.uuid} h='14.5em' className={classes.grid_card} style={{padding: '12px'}}>
                <span
                style={{
                    position: "absolute",
                    top: '.667em',
                    right: '.75em',
                    width: '1em',
                    height: '1em',
                }}>⚙️</span>
                <Text fw={ 700 } span>
                    { m.client.name }
                </Text>
                <Text c={ getStatusColor(m.client.status) } span>
                    { getStatusText(m.client.status) }
                </Text>
                <Space h={7}></Space>
                <Divider></Divider>
                <Space h={15}></Space>
                <SpanRow startingText='Address: ' endingText={m.client.address}></SpanRow>
                <Space h={10}></Space>
                <SpanRow startingText='Type: ' endingText={m.client.clientType}></SpanRow>
                <Space h={10}></Space>
                <SpanRow startingText='Strips: ' endingText={'' + m.strips.length}></SpanRow>
                <Space h={10}></Space>
                <SpanRow startingText='Active effects: ' endingText={'' + m.client.activeEffects}></SpanRow>
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
        <Text className={classes.subtle_text} span>{ props.endingText }</Text>
    </span>
}

function getStatusText(status: ClientStatus) {
    /// Split setup incomplete into two words
    if (status === ClientStatus.SetupIncomplete) {
        return 'Setup incomplete';
    } else {
        return status.toString();
    }
}

function getStatusColor(status: ClientStatus) {
    switch (status) {
        case ClientStatus.SetupIncomplete:
            return statusColors.warning;
        case ClientStatus.Idle:
        case ClientStatus.Active:
            return statusColors.ok;
        case ClientStatus.Disconnected:
            return statusColors.disconnected;
        case ClientStatus.Error:
            return statusColors.error;
        default:
            return statusColors.error;
    }
}
