import { Center } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { ClientStatus, getClients, type ILedStripClient } from "~/api/clients_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../TextHelper";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";

function ClientTable() {
    const isLightMode = useContext(IsLightModeContext);
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsList = await getClients();
                setClients(clientsList);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (loading) {
        return <BoundedLoadingOverlay loading />;
    } else if (error) {
        console.log('Showing error ' + error);
        return <Center>
            <div>
                Error fetching clients
            </div>
        </Center>;
    }

    const dataRows = clients.map(c => ({
        name: c.name,
        uuid: c.uuid,
        status: c.status == ClientStatus.Offline ? 'Offline since ' + getLastSeenAtString(c.lastSeenAt) : getClientStatusText(c.status),
        statusColor: getClientStatusColor(c.status, isLightMode),
        secondColString: c.address,
        thirdColString: c.clientType,
    }));

    return <TableWithTrailingButton dataRows={dataRows} dataCols={['Name', 'Address', 'Type']} onClicked={onClicked} />;
}

// TODO: open edit form
function onClicked(clientUuid: string) {
    console.log("Client clicked:", clientUuid);
}

export default ClientTable;