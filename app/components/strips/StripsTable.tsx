import { Center } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { TableWithTrailingButton } from "../layouts/TableWithTrailingButton";
import { getStripStatusColor, getStripStatusText } from "../TextHelper";

export function StripsTable() {
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLightMode = useContext(IsLightModeContext);

    useEffect(() => {
        if (loading) {
            getStrips().then((stripsList) => {
                setStrips(stripsList);
                setLoading(false);
            }).catch((error) => {
                setError(error);
                setLoading(false);
            });
        }

        return () => { };
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

    return <TableWithTrailingButton dataRows={dataRows} dataCols={['Name', 'Length', 'Brightness']} onEditClicked={onEditClicked} onDeleteClicked={onDeleteClicked} />;
}

// TODO: open edit form
function onEditClicked(stripUuid: string) {
    console.log("LED strip clicked:", stripUuid);
}

// TODO: open "are you sure" delete modal
function onDeleteClicked(stripUuid: string) {
    console.log("LED strip deleted:", stripUuid);
}