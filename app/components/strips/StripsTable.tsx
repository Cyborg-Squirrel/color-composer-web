import { Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useContext, useEffect, useState } from "react";
import type { ILedStripClient } from "~/api/clients_api";
import type { ILedStrip } from "~/api/strips_api";
import { useStripApi } from "~/context/api/StripApiContext";
import { IsLightModeContext } from "~/context/ui/IsLightModeContext";
import { IsMobileContext } from "~/context/ui/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getStripStatusColor, getStripStatusText } from "../TextHelper";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";
import StripFormModal from "./StripFormModal";

interface IStripsTableProps {
    clients: ILedStripClient[] | undefined;
    refreshKey?: number;
}

export function StripsTable({ clients, refreshKey }: IStripsTableProps) {
    const stripApi = useStripApi().stripApi!;
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [selectedStripUuid, setStripUuid] = useState<string>("");
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isLightMode = useContext(IsLightModeContext);
    const isMobile = useContext(IsMobileContext);

    const fetchStrips = useCallback(async () => {
        try {
            setStrips(await stripApi.getStrips());
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStrips();
    }, [fetchStrips, refreshKey]);

    if (loading || clients === undefined) {
        return <BoundedLoadingOverlay loading />;
    } else if (error) {
        console.log('Showing error ' + error);
        return <Center>
            <div>
                Error fetching LED strips
            </div>
        </Center>
    }

    const handleEditSuccess = () => {
        close();
        fetchStrips();
    };

    const dataRows = strips.map(s => ({
        name: s.name,
        uuid: s.uuid,
        status: getStripStatusText(s.activeEffects),
        statusColor: getStripStatusColor(s.activeEffects, isLightMode),
        secondColString: s.length.toString(),
        thirdColString: s.brightness + '%',
    }));

    return (<>
        <StripFormModal
            opened={modalOpened}
            onClose={close}
            isMobile={isMobile}
            strip={strips.find(s => s.uuid === selectedStripUuid)}
            clients={clients}
            title='Edit Strip'
            onSuccess={handleEditSuccess}
        />
        <TableWithTrailingButton dataRows={dataRows} dataCols={['Name', 'Length', 'Brightness']} onClicked={(uuid) => {
            setStripUuid(uuid);
            open();
        }} />
    </>)
}
