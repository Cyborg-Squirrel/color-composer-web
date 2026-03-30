import { Center, SimpleGrid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import type { ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "~/context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import ClientCard from "./ClientCard";
import ClientFormModal from "./ClientFormModal";

interface IClientGridProps {
    clients: ILedStripClient[] | undefined;
}

interface IClientUiModel {
    client: ILedStripClient;
    strips: ILedStrip[];
}

export function ClientGrid({ clients }: IClientGridProps) {
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoverUuid, setHoverUuid] = useState<string | null>(null);
    const [clickedUuid, setClickedUuid] = useState<string | null>(null);
    const [modalOpened, { open, close }] = useDisclosure(false);
    let isLightMode = useContext(IsLightModeContext);
    let isMobile = useContext(IsMobileContext);

    useEffect(() => {
        getStrips().then(fetchedStrips => {
            setStrips(fetchedStrips);
            setLoading(false);
        }).catch((err) => {
            setError(err);
            setLoading(false);
        });
    }, []);

    if (loading || clients === undefined) {
        return <BoundedLoadingOverlay loading />
    } else if (error) {
        console.log('Showing error ' + error);
        return <Center>
            <div>
                Error fetching clients
            </div>
        </Center>
    }

    const uiModels: IClientUiModel[] = clients.map(c => ({
        client: c,
        strips: strips.filter(s => s.clientUuid == c.uuid),
    }));

    const gridItems = uiModels.map((m) => (
        <ClientCard
            key={m.client.uuid}
            client={m.client}
            strips={m.strips}
            isLightMode={isLightMode}
            isMobile={isMobile}
            isHovered={m.client.uuid === hoverUuid}
            onHoverEnter={() => setHoverUuid(m.client.uuid)}
            onHoverLeave={() => setHoverUuid(null)}
            onClick={(uuid: string) => {
                setClickedUuid(uuid);
                open();
            }}
        />
    ));

    const selectedModel = uiModels.find(m => m.client.uuid == clickedUuid);

    return (<>
        <ClientFormModal
            opened={modalOpened}
            onClose={close}
            onSuccess={close}
            isMobile={isMobile}
            client={selectedModel?.client}
            strips={selectedModel?.strips ?? []}
            title='Edit client'
        />
        <SimpleGrid
            cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
            spacing={{ base: 10, sm: 'md' }}
            verticalSpacing={{ base: 'md', sm: 'md' }}>
            {gridItems}
        </SimpleGrid></>
    );
}
