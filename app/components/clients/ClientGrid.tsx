import { ActionIcon, Card, Center, Divider, Modal, SimpleGrid, Space, Text } from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { ClientStatus, getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "~/context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../TextHelper";
import ClientForm from "./ClientForm";
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
    const [hoverUuid, setHoverUuid] = useState<string | null>(null);
    // TODO Move Card to separate component.
    // useHover hook only applies to the last card created by uiModels.map().
    const { hovered, ref } = useHover();
    const [drawerOpened, { open, close }] = useDisclosure(false);
    let isLightMode = useContext(IsLightModeContext);
    let isMobile = useContext(IsMobileContext);

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
        <Card key={m.client.uuid} h='14em' className={classes.grid_card} style={{
            padding: '12px',
            outline: m.client.uuid == hoverUuid ? '3px solid var(--app-shell-border-color)' : '1px solid var(--app-shell-border-color)',
            backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))',
            transition: 'transform .2s'
            }} onMouseEnter={() => setHoverUuid(m.client.uuid)} onMouseLeave={() => setHoverUuid(null)} ref={ref} onClick={open}>
            <span
                style={{
                    position: "absolute",
                    top: '.25em',
                    right: '.25em',
                }}>
                <ActionIcon variant="transparent" size="lg" c={shouldShowEditIcon(m.client.uuid, hoverUuid, isMobile) ? undefined : 'transparent'} style={{ transform: 'scaleX(-1)', filter: 'grayscale(100%)' }}>✏️</ActionIcon>
            </span>
            <Text fw={700} span>
                {m.client.name}
            </Text>
            <Text c={getClientStatusColor(m.client.status, isLightMode)} span>
                {getStatusText(m.client.status, m.client.lastSeenAt)}
            </Text>
            <Space h={6}></Space>
            <Divider></Divider>
            <Space h={12}></Space>
            <SpanRow startingText='Address: ' endingText={m.client.address}></SpanRow>
            <Space h={10}></Space>
            <SpanRow startingText='Type: ' endingText={m.client.clientType}></SpanRow>
            <Space h={10}></Space>
            <SpanRow startingText='Active effects: ' endingText={'' + m.client.activeEffects}></SpanRow>
        </Card>
    ));

    return (<>
        <Modal radius="md" size="lg" fullScreen={isMobile} opened={drawerOpened}
            onClose={close} closeButtonProps={{ size: 'lg' }} title='Edit client'>
            <ClientForm client={getSelectedModel(uiModels, hoverUuid)?.client} strips={getSelectedModel(uiModels, hoverUuid)?.strips ?? []} isMobile={isMobile} onSubmit={close} />
        </Modal>
        <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            spacing={{ base: 10, sm: 'md' }}
            verticalSpacing={{ base: 'md', sm: 'md' }}>
            {gridItems}
        </SimpleGrid></>
    );
}

function getSelectedModel(uiModels: IClientUiModel[], selectedClientUuid: string | null) {
    return uiModels.find(m => m.client.uuid == selectedClientUuid);
}

function shouldShowEditIcon(clientUuid: string, hoverUuid: string | null, isMobile: boolean): boolean {
    return hoverUuid == clientUuid && !isMobile;
}

function SpanRow(props: { startingText: string, endingText: string }) {
    return <span>
        <Text fw={700} span>{props.startingText}</Text>
        <Text className={classes.subtle_text} span>{props.endingText}</Text>
    </span>
}

function getStatusText(status: ClientStatus, lastSeenAt: number): string {
    if (status == ClientStatus.Offline) {
        return 'Offline since ' + getLastSeenAtString(lastSeenAt);
    } else {
        return getClientStatusText(status);
    }
}
