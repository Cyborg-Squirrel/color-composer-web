import { Button, Group, NumberInput, Select, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { forwardRef, useImperativeHandle, useState } from "react";
import { NightDriverType, PiClientType, type ILedStripClient } from "~/api/clients/clients_api";
import { blendModes, piPins, type BlendMode, type ILedStrip } from "~/api/strips/strips_api";
import { FormSubmitButton } from "~/components/forms/FormSubmitButton";
import { useStripApi } from "~/provider/StripApiContext";

interface IStripFormProps {
    clients: ILedStripClient[];
    strip: ILedStrip | undefined;
    isMobile: boolean;
    closeForm: () => void;
    onSuccess: () => void;
}

export interface IStripFormHandle {
    isDirty: () => boolean;
}

const StripForm = forwardRef<IStripFormHandle, IStripFormProps>((props, ref) => {
    let strip = props.strip;
    const stripApi = useStripApi().stripApi!;
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [selectedClientUuid, setSelectedClientUuid] = useState<string>(strip?.clientUuid || '');
    const selectedClient = props.clients.find(c => c.uuid === selectedClientUuid);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: strip?.name || '',
            clientUuid: strip?.clientUuid || '',
            pin: strip?.pin || '',
            length: strip?.length || 60,
            height: strip?.height || 1,
            brightness: strip?.brightness ?? 0,
            blendMode: strip?.blendMode || 'Additive' as BlendMode,
        },
        validate: {
            name: (value) => (value.length > 0 && value.length <= 50 ? null : 'Name is required and must be 50 characters or less'),
            clientUuid: (value) => (value ? null : 'Client is required'),
            pin: (value, values) => {
                if (!values.clientUuid) return null;
                const client = props.clients.find(c => c.uuid === values.clientUuid);
                if (client?.clientType === PiClientType) {
                    return piPins.some(p => p === value) ? null : `Must be one of: ${piPins.join(', ')}`;
                } else if (client?.clientType === NightDriverType) {
                    const channel = Number(value);
                    return (!isNaN(channel) && channel >= 1 && channel <= 8) ? null : 'Must be a channel number from 1–8';
                }
                return value ? null : 'Pin is required';
            },
            length: (value) => {
                return (value > 0) ? null : 'Length must be a positive number';
            },
            brightness: (value) => {
                return (value >= 0 && value <= 100) ? null : 'Brightness must be between 0 and 100';
            },
        }
    });

    useImperativeHandle(ref, () => ({
        isDirty: () => form.isDirty(),
    }));

    const handleClientChange = (uuid: string | null) => {
        const newUuid = uuid ?? '';
        form.setFieldValue('clientUuid', newUuid);
        form.setFieldValue('pin', '');
        setSelectedClientUuid(newUuid);
    };

    const handleSubmit = async (values: typeof form.values) => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            if (strip) {
                await stripApi.updateStrip(strip.uuid, {
                    name: values.name,
                    clientUuid: values.clientUuid,
                    pin: values.pin,
                    length: values.length,
                    height: values.height,
                    brightness: values.brightness,
                    blendMode: values.blendMode,
                });
            } else {
                await stripApi.createStrip({
                    clientUuid: values.clientUuid,
                    name: values.name,
                    pin: values.pin,
                    length: values.length,
                    height: values.height,
                    brightness: values.brightness,
                    blendMode: values.blendMode,
                });
            }
            props.onSuccess();
        } catch (err: any) {
            setSubmitError(err.message || 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const pinInputProps = form.getInputProps('pin');

    const getPinInput = () => {
        if (!selectedClientUuid) {
            return (
                <TextInput
                    withAsterisk
                    label="Data pin"
                    placeholder="Select a client first"
                    disabled
                    size={props.isMobile ? "md" : "sm"}
                />
            );
        }
        if (selectedClient?.clientType === PiClientType) {
            return (
                <Select
                    withAsterisk
                    label="Data pin"
                    placeholder="Select a pin"
                    data={piPins}
                    key={`pin-${selectedClientUuid}`}
                    {...pinInputProps}
                    size={props.isMobile ? "md" : "sm"}
                />
            );
        }
        // NightDriver: numeric channel 1–8
        return (
            <NumberInput
                withAsterisk
                label="Data pin"
                key={`pin-${selectedClientUuid}`}
                defaultValue={pinInputProps.defaultValue ? Number(pinInputProps.defaultValue) : undefined}
                onChange={(value) => form.setFieldValue('pin', String(value))}
                error={pinInputProps.error}
                min={1}
                max={8}
                allowNegative={false}
                size={props.isMobile ? "md" : "sm"}
            />
        );
    };

    // Note: mobile needs size 16 font for inputs to prevent zoom on focus
    // in my testing on iOS you can't zoom out once zoomed in
    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="The strip's name"
                key={form.key('name')}
                {...form.getInputProps('name')}
                size={props.isMobile ? "md" : "sm"}
            />

            <Select
                pt="sm"
                withAsterisk
                label="Client"
                placeholder="Select the client this strip is connected to"
                data={props.clients.map(c => ({ value: c.uuid, label: c.name }))}
                key={form.key('clientUuid')}
                {...form.getInputProps('clientUuid')}
                onChange={handleClientChange}
                size={props.isMobile ? "md" : "sm"}
            />

            <Group pt="sm" justify="center" grow>
                {getPinInput()}
                <NumberInput
                    withAsterisk
                    label="Length"
                    placeholder="Number of LEDs"
                    key={form.key('length')}
                    {...form.getInputProps('length')}
                    size={props.isMobile ? "md" : "sm"}
                    allowNegative={false}
                    min={1}
                />
            </Group>

            <Group pt="sm" justify="center" grow>
                <NumberInput
                    label="Brightness"
                    suffix="%"
                    placeholder="Optional"
                    key={form.key('brightness')}
                    {...form.getInputProps('brightness')}
                    size={props.isMobile ? "md" : "sm"}
                    allowNegative={false}
                    min={0}
                    max={100}
                />
                <NumberInput
                    label="Height"
                    placeholder="For 2D grids"
                    key={form.key('height')}
                    {...form.getInputProps('height')}
                    size={props.isMobile ? "md" : "sm"}
                    allowNegative={false}
                    min={1}
                />
            </Group>

            <Select
                pt="sm"
                label="Blend Mode"
                data={blendModes}
                key={form.key('blendMode')}
                {...form.getInputProps('blendMode')}
                size={props.isMobile ? "md" : "sm"}
            />

            {submitError && <Text c="red" size="sm" pt="sm">{submitError}</Text>}

            <Group justify="flex-end" mt="xl" grow={props.isMobile}>
                <Button variant="default" type="button" onClick={props.closeForm}>Cancel</Button>
                <FormSubmitButton disabled={!form.isDirty()} loading={submitting} />
            </Group>
        </form>
    );
});

export default StripForm;
