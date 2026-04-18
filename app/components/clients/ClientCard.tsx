import { ActionIcon, Card, Divider, Space, Text } from "@mantine/core";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { ClientStatus, type ILedStripClient } from "~/api/clients/clients_api";
import { type ILedStrip } from "~/api/strips/strips_api";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../util/TextHelper";
import classes from './ClientGrid.module.css';

interface IClientCardProps {
    client: ILedStripClient;
    strips: ILedStrip[];
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
            className={`${classes.card} ${props.isHovered ? classes.grid_card_hovered : classes.grid_card}`}
            onMouseEnter={props.onHoverEnter}
            onMouseLeave={props.onHoverLeave}
            onClick={() => {
                props.onClick(props.client.uuid);
            }}
        >
            <span className={classes.icon_container}>
                <ActionIcon
                    variant="transparent"
                    size="lg"
                    c={shouldShowIcon ? undefined : 'transparent'}
                >
                    <PencilSimpleIcon size={24} />
                </ActionIcon>
            </span>
            <Text fw={700} span>
                {props.client.name}
            </Text>
            <Text c={getClientStatusColor(props.client.status)} span>
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
