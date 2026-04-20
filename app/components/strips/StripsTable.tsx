import { Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { useStripApi } from "~/provider/StripApiContext";
import BoundedLoadingOverlay from "../controls/BoundedLoadingOverlay";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";
import { getStripStatusColor, getStripStatusText } from "../util/TextHelper";
import StripFormModal from "./StripFormModal";

interface IStripsTableProps {
    clients: ILedStripClient[] | undefined;
    refreshKey?: number;
}

export function StripsTable({ clients, refreshKey }: IStripsTableProps) {
    const stripApi = useStripApi();
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [selectedStripUuid, setStripUuid] = useState<string>("");
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = isMobileUi();

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
        statusColor: getStripStatusColor(s.activeEffects),
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
