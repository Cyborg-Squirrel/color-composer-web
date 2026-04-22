import { Center, SimpleGrid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { useClientApi } from "~/provider/ClientApiContext";
import { useStripApi } from "~/provider/StripApiContext";
import BoundedLoadingOverlay from "../controls/BoundedLoadingOverlay";
import ClientCard from "./ClientCard";
import ClientFormModal from "./ClientFormModal";

interface IClientUiModel {
    client: ILedStripClient;
    strips: ILedStrip[];
}

export function ClientGrid() {
    const clientApi = useClientApi();
    const stripsApi = useStripApi();
    const [refreshKey, setRefreshKey] = useState(0);
    const [clients, setClients] = useState<ILedStripClient[] | undefined>(undefined);
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoverUuid, setHoverUuid] = useState<string | null>(null);
    const [clickedUuid, setClickedUuid] = useState<string | null>(null);
    const [modalOpened, { open, close }] = useDisclosure(false);
    let isMobile = isMobileUi();

    useEffect(() => {
        setClients(undefined);
        setStrips([]);
        Promise.all([clientApi.getClients(), stripsApi.getStrips()])
            .then(([fetchedClients, fetchedStrips]) => {
                setClients(fetchedClients);
                setStrips(fetchedStrips);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data', err);
                setError(err);
                setLoading(false);
            });
    }, [refreshKey]);

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

    const handleEditSuccess = () => {
        close();
        setRefreshKey(k => k + 1);
    };

    return <>
        <ClientFormModal
            opened={modalOpened}
            onClose={close}
            onSuccess={handleEditSuccess}
            isMobile={isMobile}
            client={selectedModel?.client}
            strips={selectedModel?.strips ?? []}
            title='Edit client'
        />
        <SimpleGrid
            cols={{ base: 1, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
            spacing={{ base: 10, sm: 'md' }}
            verticalSpacing={{ base: 'md', sm: 'md' }}>
            {gridItems}
        </SimpleGrid>
    </>;
}
