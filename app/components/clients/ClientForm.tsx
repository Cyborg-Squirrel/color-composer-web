import { Button, Group, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { colorOrders, type ILedStripClient } from "~/api/clients_api";
import type { ILedStrip } from "~/api/strips_api";

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

    // Note: mobile needs size 16 font for inputs to prevent zoom on focus
    // in my testing on iOS you can't zoom out once zoomed in
    return (
        <form onSubmit={form.onSubmit((values) => { console.log(values); props.onSubmit(); })}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="The client's name"
                key={form.key('name')}
                {...form.getInputProps('name')}
                size={props.isMobile ? "md" : "sm"}
            />

            <TextInput
                pt="sm"
                withAsterisk
                label="Address"
                placeholder="The client's network address"
                key={form.key('address')}
                {...form.getInputProps('address')}
                size={props.isMobile ? "md" : "sm"}
            />

            <Group pt="sm" justify="center" grow>
                <NumberInput
                    withAsterisk
                    hideControls
                    label="WebSocket Port"
                    placeholder="The client's WebSocket port"
                    key={form.key('wsPort')}
                    {...form.getInputProps('wsPort')}
                    size={props.isMobile ? "md" : "sm"}
                />

                <NumberInput
                    withAsterisk
                    hideControls
                    label="API Port"
                    placeholder="The client's API port"
                    key={form.key('apiPort')}
                    {...form.getInputProps('apiPort')}
                    size={props.isMobile ? "md" : "sm"}
                />
            </Group>

            <Select
                pt="sm"
                label="LED Strip"
                placeholder="Select the LED strip connected to this client"
                data={props.strips.map(s => ({ value: s.uuid, label: s.name }))}
                key={form.key('ledStrip')}
                {...form.getInputProps('ledStrip')}
                size={props.isMobile ? "md" : "sm"}
            />

            <Select
                pt="sm"
                withAsterisk
                label="Color Order"
                placeholder="Select RGB color order for this client"
                data={colorOrders}
                key={form.key('colorOrder')}
                {...form.getInputProps('colorOrder')}
                size={props.isMobile ? "md" : "sm"}
            />

            <Group justify="flex-end" mt="xl" grow={props.isMobile}>
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
}

export default ClientForm;