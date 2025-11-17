import { Button, Center, Drawer, Group, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useState } from "react";
import { ClientStatus, colorOrders, getClients, type ILedStripClient } from "~/api/clients_api";
import { getStrips, type ILedStrip } from "~/api/strips_api";
import { IsLightModeContext } from "~/context/IsLightModeContext";
import { IsMobileContext } from "~/context/IsMobileContext";
import { BoundedLoadingOverlay } from "../BoundedLoadingOverlay";
import { getClientStatusColor, getClientStatusText, getLastSeenAtString } from "../TextHelper";
import TableWithTrailingButton from "../layouts/ThreeColumnTable";

function ClientTable() {
    const isLightMode = useContext(IsLightModeContext);
    const isMobile = useContext(IsMobileContext);
    const [clients, setClients] = useState<ILedStripClient[]>([]);
    const [strips, setStrips] = useState<ILedStrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [selectedClientUuid, setClientUuid] = useState<string>("");
    const [drawerOpened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const clientsList = await getClients();
                const stripsList = await getStrips();
                setStrips(stripsList);
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

    return (<>
        <Drawer offset={8} radius="md" size="lg" position="right" opened={drawerOpened}
            onClose={close} closeButtonProps={{ size: 'lg' }} title='Edit client'>
            <ClientForm client={clients.find(c => c.uuid == selectedClientUuid)} strips={strips} isMobile={isMobile} onSubmit={close} />
        </Drawer>
        <TableWithTrailingButton dataRows={dataRows} dataCols={['Name', 'Address', 'Type']} onClicked={(uuid) => {
            setClientUuid(uuid);
            open();
        }} />
    </>)
}

interface IClientFormProps {
    client: ILedStripClient | undefined;
    strips: ILedStrip[];
    isMobile: boolean;
    onSubmit: () => void;
}

function ClientForm(props: IClientFormProps) {
    let client = props.client;
    let strip = client ? props.strips.find(s => s.clientUuid == client.uuid) : undefined;
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: client?.name || '',
            address: client?.address || '',
            wsPort: client?.wsPort || '',
            apiPort: client?.apiPort || '',
            ledStrip: strip?.uuid || '',
            colorOrder: client?.colorOrder || 'RGB',
        },
        // validate: (values) => {
        //     if (values.wsPort === values.apiPort) {
        //         return {
        //             wsPort: 'WebSocket port must be different from API port',
        //             apiPort: 'API port must be different from WebSocket port',
        //         };
        //     } return {};
        // },
        validate: {
            name: (value) => (value.length <= 20 ? null : 'Invalid name'),
            address: (value) => {
                const urlPattern = /^(https?:\/\/)/;
                const ipPattern = /^(https?:\/\/)([0-9]{1,3}\.){3}[0-9]{1,3}/;

                if (!urlPattern.test(value) && !ipPattern.test(value)) {
                    return 'Address must start with http:// or https:// followed by a valid URL or IP address';
                }
                return null;
            },
            wsPort: (value) => {
                const port = Number(value);
                if (isNaN(port) || port < 1 || port > 65535) {
                    return 'WebSocket port must be a number between 1 and 65535';
                }
                return null;
            },
            apiPort: (value) => {
                const port = Number(value);
                if (isNaN(port) || port < 1 || port > 65535) {
                    return 'API port must be a number between 1 and 65535';
                }
                return null;
            },
            ledStrip: (value) => {
                // This field is optional
                return null;
            },
        }
    });

    return (
        <form onSubmit={form.onSubmit((values) => { console.log(values); props.onSubmit(); })}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="The client's name"
                key={form.key('name')}
                {...form.getInputProps('name')}
            />

            <TextInput
                pt="sm"
                withAsterisk
                label="Address"
                placeholder="The client's network address"
                key={form.key('address')}
                {...form.getInputProps('address')}
            />

            <Group pt="sm" justify="center" grow>
                <NumberInput
                    withAsterisk
                    hideControls
                    label="WebSocket Port"
                    placeholder="The client's WebSocket port"
                    key={form.key('wsPort')}
                    {...form.getInputProps('wsPort')}
                />

                <NumberInput
                    withAsterisk
                    hideControls
                    label="API Port"
                    placeholder="The client's API port"
                    key={form.key('apiPort')}
                    {...form.getInputProps('apiPort')}
                />
            </Group>

            <Select
                pt="sm"
                label="LED Strip"
                placeholder="Select the LED strip connected to this client"
                data={props.strips.map(s => ({ value: s.uuid, label: s.name }))}
                key={form.key('ledStrip')}
                {...form.getInputProps('ledStrip')}
            />

            <Select
                pt="sm"
                withAsterisk
                label="Color Order"
                placeholder="Select RGB color order for this client"
                data={colorOrders}
                key={form.key('colorOrder')}
                {...form.getInputProps('colorOrder')}
            />

            <Group justify="flex-end" mt="xl" grow={props.isMobile}>
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
}

export default ClientTable;