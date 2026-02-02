import { Center, SimpleGrid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "~/context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import ClientCard from "./ClientCard";
import ClientFormModal from "./ClientFormModal";

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
    const [clickedUuid, setClickedUuid] = useState<string | null>(null);
    const [modalOpened, { open, close }] = useDisclosure(false);
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

    return (<>
        <ClientFormModal
            opened={modalOpened}
            onClose={close}
            isMobile={isMobile}
            client={getSelectedModel(uiModels, clickedUuid)?.client}
            strips={getSelectedModel(uiModels, clickedUuid)?.strips ?? []}
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

function getSelectedModel(uiModels: IClientUiModel[], selectedClientUuid: string | null) {
    return uiModels.find(m => m.client.uuid == selectedClientUuid);
}
