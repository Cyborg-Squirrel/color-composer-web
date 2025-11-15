import { Center } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getStripStatusColor, getStripStatusText } from "../TextHelper";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";

export function StripsTable() {
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const isLightMode = useContext(IsLightModeContext);

    useEffect(() => {
        const fetchStrips = async () => {
            try {
                const stripsList = await getStrips();
                setStrips(stripsList);
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

    return <TableWithTrailingButton dataRows={dataRows} dataCols={['Name', 'Length', 'Brightness']} onClicked={onClicked}/>;
}

// TODO: open edit form
function onClicked(stripUuid: string) {
    console.log("LED strip clicked:", stripUuid);
}