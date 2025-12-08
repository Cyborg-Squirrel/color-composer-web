import { Center, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "~/context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getStripStatusColor, getStripStatusText } from "../TextHelper";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";
import StripForm from "./StripForm";

export function StripsTable() {
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [selectedStripUuid, setStripUuid] = useState<string>("");
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isLightMode = useContext(IsLightModeContext);
    const isMobile = useContext(IsMobileContext);

    useEffect(() => {
        const fetchStrips = async () => {
            try {
                const [strips, clients] = await Promise.all([
                    getStrips(),
                    getClients()
                ]);
                setStrips(strips);
                setClients(clients);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchStrips();
    }, []);

    if (loading) {
        return <BoundedLoadingOverlay loading />;
    } else if (error) {
        console.log('Showing error ' + error);
        return <Center>
            <div>
                Error fetching LED strips
            </div>
        </Center>
    }

    const dataRows = strips.map(s => ({
        name: s.name,
        uuid: s.uuid,
        status: getStripStatusText(s.activeEffects),
        statusColor: getStripStatusColor(s.activeEffects, isLightMode),
        secondColString: s.length.toString(),
        thirdColString: s.brightness + '%',
    }));

    return (<>
        <Modal radius="md" size="lg" fullScreen={isMobile} opened={modalOpened}
            onClose={close} closeButtonProps={{ size: 'lg' }} title='Edit Strip'>
            <StripForm strip={strips.find(c => c.uuid == selectedStripUuid)} clients={clients} isMobile={isMobile} onSubmit={close} />
        </Modal>
        <TableWithTrailingButton dataRows={dataRows} dataCols={['Name', 'Length', 'Brightness']} onClicked={(uuid) => {
            setStripUuid(uuid);
            open();
        }} />
    </>)
}
