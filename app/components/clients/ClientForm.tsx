import { Button, Group, MultiSelect, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { forwardRef, useImperativeHandle, useState } from "react";
import { clientTypes, colorOrders, PiClientType, type ClientType, type ILedStripClient } from "~/api/clients_api";
import type { ILedStrip } from "~/api/strips_api";

interface IClientFormProps {
    client: ILedStripClient | undefined;
    strips: ILedStrip[];
    isMobile: boolean;
    closeForm: () => void;
    onSuccess: () => void;
}

export interface IClientFormHandle {
    isDirty: () => boolean;
}

const ClientForm = forwardRef<IClientFormHandle, IClientFormProps>((props, ref) => {
    let client = props.client;
    let isNewClient = client == undefined;
    let clientStrips = client ? props.strips.filter(s => s.clientUuid == client.uuid) : [];
    const [clientType, setClientType] = useState<ClientType>(client?.clientType || PiClientType);
    const [typeChanged, setTypeChanged] = useState(false);
    let multipleStripsSupported = clientType !== PiClientType;
    let customPowerLimitSupported = clientType === PiClientType;
    const initialLedStrips = clientStrips.map(s => s.uuid);
    const [ledStripsValue, setLedStripsValue] = useState<string[]>(initialLedStrips);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: client?.name || '',
            address: client?.address || '',
            wsPort: client?.wsPort || '',
            apiPort: client?.apiPort || '',
            ledStrips: initialLedStrips,
            colorOrder: client?.colorOrder || 'RGB',
            clientType: client?.clientType || PiClientType,
            powerLimit: client?.powerLimit || '',
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
            ledStrips: (value) => {
                // This field is optional
                return null;
            },
            clientType: (value) => (clientTypes.includes(value) ? null : 'Invalid client type'),
            colorOrder: (value) => (colorOrders.includes(value) ? null : 'Invalid color order'),
            powerLimit: (value) => {
                // This field is optional
                return null;
            },
        }
    });

    form.watch('ledStrips', ({ value }) => setLedStripsValue(value as string[]));

    useImperativeHandle(ref, () => ({
        isDirty: () => form.isDirty(),
    }));

    // Note: mobile needs size 16 font for inputs to prevent zoom on focus
    // in my testing on iOS you can't zoom out once zoomed in
    return (
        <form onSubmit={form.onSubmit((values) => { console.log(values); props.onSuccess(); })}>
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

            {multipleStripsSupported ?
                <MultiSelect
                    pt="sm"
                    label="LED Strips"
                    placeholder="Select the LED strips connected to this client"
                    data={props.strips.map(s => ({ value: s.uuid, label: s.name }))}
                    key={form.key('ledStrips')}
                    {...form.getInputProps('ledStrips')}
                    size={props.isMobile ? "md" : "sm"}
                    disabled={typeChanged}
                /> :
                <Select
                    pt="sm"
                    label="LED Strip"
                    placeholder="Select the LED strip connected to this client"
                    data={props.strips.map(s => ({ value: s.uuid, label: s.name }))}
                    key={form.key('ledStrips')}
                    defaultValue={ledStripsValue[0] ?? null}
                    onChange={(value) => form.setFieldValue('ledStrips', value ? [value] : [])}
                    error={form.errors.ledStrips}
                    size={props.isMobile ? "md" : "sm"}
                    disabled={typeChanged}
                />}

            <Group pt="sm" justify="center" grow>
                <NumberInput
                    withAsterisk
                    hideControls
                    label="WebSocket Port"
                    placeholder="The client's WebSocket port"
                    key={form.key('wsPort')}
                    {...form.getInputProps('wsPort')}
                    size={props.isMobile ? "md" : "sm"}
                    allowNegative={false}
                />

                <NumberInput
                    withAsterisk
                    hideControls
                    label="API Port"
                    placeholder="The client's API port"
                    key={form.key('apiPort')}
                    {...form.getInputProps('apiPort')}
                    size={props.isMobile ? "md" : "sm"}
                    allowNegative={false}
                />
            </Group>

            <Group pt="sm" justify="center" grow>
                <Select
                    withAsterisk
                    label="Color Order"
                    placeholder="Select RGB color order for this client"
                    data={colorOrders}
                    key={form.key('colorOrder')}
                    {...form.getInputProps('colorOrder')}
                    size={props.isMobile ? "md" : "sm"}
                />

                <Select
                    withAsterisk
                    label="Client Type"
                    placeholder="Select the client type"
                    data={clientTypes}
                    key={form.key('clientType')}
                    {...form.getInputProps('clientType')}
                    onChange={(value) => {
                        form.setFieldValue('clientType', value as ClientType);
                        setClientType(value as ClientType);
                        // Client changed flag is used to determine if the user can add/remove strips.
                        // For new clients this is always allowed.
                        setTypeChanged(!isNewClient && value != client?.clientType);
                    }}
                    disabled={ledStripsValue.length > 0}
                    size={props.isMobile ? "md" : "sm"}
                />
            </Group>

            <NumberInput
                pt="sm"
                withAsterisk
                disabled={customPowerLimitSupported ? false : true}
                label="Power Limit"
                suffix=" mA"
                placeholder={client?.clientType === PiClientType ? "The client's power limit" : "NightDriver power limits are set in the build config"}
                key={form.key('powerLimit')}
                {...form.getInputProps('powerLimit')}
                size={props.isMobile ? "md" : "sm"}
                min={1}
                allowNegative={false}
            />

            <Group justify="flex-end" mt="xl" grow={props.isMobile}>
                <Button variant="default" type="button" onClick={props.closeForm}>Cancel</Button>
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
});

export default ClientForm;