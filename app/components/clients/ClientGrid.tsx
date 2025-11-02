import { Card, Center, Divider, SimpleGrid, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { ClientStatus, getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { statusColors } from "../status";
import classes from './ClientGrid.module.css';

interface IClientGridProps { }

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

        return () => { };
    }, []);

    if (loading) {
        return <BoundedLoadingOverlay loading />
    } else if (error) {
        console.log('Showing error ' + error);
        return <Center>
            <div>
                Error fetching clients
            </div>
        </Center>
    }

    const gridItems = uiModels.map((m) => (
        <Card key={m.client.uuid} h='14em' className={classes.grid_card} style={{ padding: '12px' }}>
            <span
                style={{
                    position: "absolute",
                    top: '.5em',
                    right: '.75em',
                    width: '1em',
                    height: '1em',
                }}>⚙️</span>
            <Text fw={700} span>
                {m.client.name}
            </Text>
            <Text c={getStatusColor(m.client.status)} span>
                {getStatusText(m.client.status)}
            </Text>
            <Space h={6}></Space>
            <Divider></Divider>
            <Space h={12}></Space>
            <SpanRow startingText='Last seen: ' endingText={getLastSeenAtString(m.client.lastSeenAt)}></SpanRow>
            <Space h={10}></Space>
            <SpanRow startingText='Address: ' endingText={m.client.address}></SpanRow>
            <Space h={10}></Space>
            <SpanRow startingText='Type: ' endingText={m.client.clientType}></SpanRow>
            <Space h={10}></Space>
            <SpanRow startingText='Active effects: ' endingText={'' + m.client.activeEffects}></SpanRow>
        </Card>
    ));

    return (
        <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            spacing={{ base: 10, sm: 'md' }}
            verticalSpacing={{ base: 'md', sm: 'md' }}>
            {gridItems}
        </SimpleGrid>
    );
}

function SpanRow(props: { startingText: string, endingText: string }) {
    return <span>
        <Text fw={700} span>{props.startingText}</Text>
        <Text className={classes.subtle_text} span>{props.endingText}</Text>
    </span>
}

function getLastSeenAtString(lastSeenAt: number) {
    let now = new Date();
    let diff = now.getTime() - lastSeenAt;
    let second = 1000;
    let minute = second * 60;
    let hour = minute * 60;
    let day = hour * 24;

    let yesterday = new Date(now.getTime() - day);
    yesterday.setHours(0);
    yesterday.setMinutes(0);
    yesterday.setSeconds(0);
    yesterday.setMilliseconds(0);

    let twoDaysAgo = new Date(now.getTime() - (day * 2));
    twoDaysAgo.setHours(0);
    twoDaysAgo.setMinutes(0);
    twoDaysAgo.setSeconds(0);
    twoDaysAgo.setMilliseconds(0);

    if (diff < second) {
        return 'now';
    } else if (diff < minute) {
        let seconds = Math.trunc(diff / second)
        if (seconds == 1) {
            return '1 second ago'
        } else {
            return seconds + ' seconds ago'
        }
    } else if (diff < hour) {
        let minutes = Math.trunc(diff / minute)
        if (minutes == 1) {
            return '1 minute ago'
        } else {
            return minutes + ' minutes ago'
        }
    } else if (lastSeenAt <= yesterday.getTime() && lastSeenAt > twoDaysAgo.getTime()) {
        return 'yesterday';
    } else if (lastSeenAt <= twoDaysAgo.getTime()) {
        return new Date(lastSeenAt).toLocaleDateString();
    }

    return new Date(lastSeenAt).toLocaleTimeString();
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
