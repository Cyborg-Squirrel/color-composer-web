import { Button, Group, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NightDriverType, PiClientType, type ILedStripClient } from "~/api/clients_api";
import { piPins, type ILedStrip } from "~/api/strips_api";

interface IStripFormProps {
    clients: ILedStripClient[];
    strip: ILedStrip | undefined;
    isMobile: boolean;
    onSubmit: () => void;
}

function StripForm(props: IStripFormProps) {
    let strip = props.strip;
    let client = props.clients.find(c => strip?.clientUuid == c.uuid);
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: strip?.name || '',
            client: client?.uuid || '',
            pin: strip?.pin || '',
            length: strip?.length || 0,
            brightness: strip?.brightness || 0,
        },
        validate: {
            name: (value) => (value.length <= 20 ? null : 'Invalid name'),
            client: (value) => {
                // TODO
                return null;
            },
            pin: (value) => {
                if (client?.clientType == PiClientType) {
                    let validPin = piPins.some(pin => pin === value);
                    if (!validPin) {
                        return `The strip's pin must be ${piPins} for a Pi client`;
                    }
                } else if (client?.clientType == NightDriverType) {
                    const channel = Number(value);
                    if (isNaN(channel) || channel < 1 || channel > 16) {
                        return `For NightDriver strips the pin represents a channel, and must be a number from 1-16.`;
                    }
                }
                return null;
            },
            length: (value) => {
                const port = Number(value);
                if (isNaN(port)) {
                    return 'Length must be a number';
                }
                return null;
            },
            brightness: (value) => {
                const brightness = Number(value);
                if (isNaN(brightness) || brightness < 0 || brightness > 100) {
                    return 'Brightness must be a number between 0 and 100';
                }
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
                placeholder="Name"
                key={form.key('name')}
                {...form.getInputProps('name')}
                size={props.isMobile ? "md" : "sm"}
            />

            <Select
                pt="sm"
                label="Client"
                placeholder=""
                data={props.clients.map(s => ({ value: s.uuid, label: s.name }))}
                key={form.key('client')}
                {...form.getInputProps('client')}
                size={props.isMobile ? "md" : "sm"}
            />

            <Group pt="sm" justify="center" grow>
                <TextInput
                    withAsterisk
                    label="Data pin"
                    placeholder=""
                    key={form.key('pin')}
                    {...form.getInputProps('pin')}
                    size={props.isMobile ? "md" : "sm"}
                />
                <NumberInput
                    withAsterisk
                    hideControls
                    label="Strip length"
                    placeholder="The strip's length"
                    key={form.key('length')}
                    {...form.getInputProps('length')}
                    size={props.isMobile ? "md" : "sm"}
                    allowNegative={false}
                />
            </Group>

            <Group pt="sm" justify="center" grow>
                <NumberInput
                    withAsterisk
                    label="Brightness"
                    suffix="%"
                    placeholder=""
                    key={form.key('brightness')}
                    {...form.getInputProps('brightness')}
                    size={props.isMobile ? "md" : "sm"}
                    allowNegative={false}
                />
            </Group>

            <Group justify="flex-end" mt="xl" grow={props.isMobile}>
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
}

export default StripForm;