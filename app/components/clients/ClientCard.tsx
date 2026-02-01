import { ActionIcon, Card, Divider, Space, Text } from "@mantine/core";
import { ClientStatus, type ILedStripClient } from "~/api/clients_api";
import { type ILedStrip } from "~/api/strips_api";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../TextHelper";
import classes from './ClientGrid.module.css';

interface IClientCardProps {
    client: ILedStripClient;
    strips: ILedStrip[];
    isLightMode: boolean;
    isMobile: boolean;
    isHovered: boolean;
    onHoverEnter: () => void;
    onHoverLeave: () => void;
    onClick: (uuid: string) => void;
}

function ClientCard(props: IClientCardProps) {
    const shouldShowIcon = props.isHovered && !props.isMobile;

    return (
        <Card
            key={props.client.uuid}
            h='14em'
            className={classes.grid_card}
            style={{
                padding: '12px',
                outline: props.isHovered ? '3px solid var(--app-shell-border-color)' : '1px solid var(--app-shell-border-color)',
                backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))',
                transition: 'transform .2s'
            }}
            onMouseEnter={props.onHoverEnter}
            onMouseLeave={props.onHoverLeave}
            onClick={() => {
                props.onClick(props.client.uuid);
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: '.25em',
                    right: '.25em',
                }}>
                <ActionIcon
                    variant="transparent"
                    size="lg"
                    c={shouldShowIcon ? undefined : 'transparent'}
                    style={{ transform: 'scaleX(-1)', filter: 'grayscale(100%)' }}
                >
                    ✏️
                </ActionIcon>
            </span>
            <Text fw={700} span>
                {props.client.name}
            </Text>
            <Text c={getClientStatusColor(props.client.status, props.isLightMode)} span>
                {getStatusText(props.client.status, props.client.lastSeenAt)}
            </Text>
            <Space h={6}></Space>
            <Divider></Divider>
            <Space h={12}></Space>
            <SpanRow startingText='Address: ' endingText={props.client.address}></SpanRow>
            <Space h={10}></Space>
            <SpanRow startingText='Type: ' endingText={props.client.clientType}></SpanRow>
            <Space h={10}></Space>
            <SpanRow startingText='Active effects: ' endingText={'' + props.client.activeEffects}></SpanRow>
        </Card>
    );
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

export default ClientCard;
