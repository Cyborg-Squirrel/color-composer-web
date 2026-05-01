import { ActionIcon, Button, ColorInput, Group, Select, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { IPalette, IPaletteMutation } from "~/api/palettes/palettes_api";
import { FormSubmitButton } from "~/components/forms/FormSubmitButton";
import { usePaletteApi } from "~/provider/PaletteApiContext";

const PALETTE_TYPES = ['custom', 'spectrum'];

interface IPaletteFormProps {
    palette: IPalette | undefined;
    isMobile: boolean;
    closeForm: () => void;
    onSuccess: () => void;
    onDelete?: () => void;
}

export interface IPaletteFormHandle {
    isDirty: () => boolean;
    isSubmitting: () => boolean;
}

const PaletteForm = forwardRef<IPaletteFormHandle, IPaletteFormProps>((props, ref) => {
    const paletteApi = usePaletteApi();
    const palette = props.palette;
    const isNew = palette === undefined;

    const initialColors = useRef<string[]>((palette?.settings?.colors as string[]) ?? ['#ff0000']);
    const [colors, setColors] = useState<string[]>(initialColors.current);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: palette?.name ?? '',
            paletteType: palette?.type ?? 'custom',
        },
        validate: {
            name: (v) => v.trim().length === 0 ? 'Name is required' : null,
        },
    });

    useImperativeHandle(ref, () => ({
        isDirty: () => form.isDirty() || JSON.stringify(colors) !== JSON.stringify(initialColors.current),
        isSubmitting: () => submitting,
    }));

    const handleSubmit = async (values: { name: string; paletteType: string }) => {
        setSubmitting(true);
        const data: IPaletteMutation = {
            name: values.name,
            paletteType: values.paletteType,
            settings: { colors },
        };
        try {
            if (palette) {
                await paletteApi.updatePalette(palette.uuid, data);
            } else {
                await paletteApi.createPalette(data);
            }
            props.onSuccess();
        } finally {
            setSubmitting(false);
        }
    };

    const addColor = () => setColors(prev => [...prev, '#000000']);
    const removeColor = (i: number) => setColors(prev => prev.filter((_, idx) => idx !== i));
    const updateColor = (i: number, value: string) => setColors(prev => prev.map((c, idx) => idx === i ? value : c));

    const inputSize = props.isMobile ? "md" : "sm";

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
                data-testid="palette-name"
                withAsterisk
                label="Name"
                placeholder="Palette name"
                key={form.key('name')}
                {...form.getInputProps('name')}
                size={inputSize}
            />
            <Select
                data-testid="palette-type"
                pt="sm"
                withAsterisk
                label="Type"
                data={PALETTE_TYPES}
                key={form.key('paletteType')}
                {...form.getInputProps('paletteType')}
                size={inputSize}
            />
            <Stack pt="sm" gap="xs">
                <Text size="sm" fw={500}>Colors</Text>
                {colors.map((color, i) => (
                    <Group key={i} gap="xs" wrap="nowrap">
                        <ColorInput
                            data-testid={`palette-color-${i}`}
                            style={{ flex: 1 }}
                            value={color}
                            onChange={(v) => updateColor(i, v)}
                            format="hex"
                            size={inputSize}
                        />
                        <ActionIcon
                            data-testid={`palette-remove-color-${i}-btn`}
                            variant="subtle"
                            color="red"
                            onClick={() => removeColor(i)}
                            disabled={colors.length <= 1}
                            size={props.isMobile ? "lg" : "md"}
                        >
                            <TrashIcon size={16} />
                        </ActionIcon>
                    </Group>
                ))}
                <Button
                    data-testid="palette-add-color-btn"
                    variant="light"
                    size="xs"
                    leftSection={<PlusIcon size={14} />}
                    onClick={addColor}
                    type="button"
                    style={{ alignSelf: 'flex-start' }}
                >
                    Add color
                </Button>
            </Stack>
            <Group justify="flex-end" mt="xl" grow={props.isMobile}>
                {!isNew && props.onDelete && (
                    <Button
                        data-testid="palette-delete-btn"
                        variant="light"
                        color="red"
                        type="button"
                        onClick={props.onDelete}
                        disabled={submitting}
                        mr="auto"
                    >
                        Delete
                    </Button>
                )}
                <Button data-testid="palette-cancel-btn" variant="default" type="button" onClick={props.closeForm} disabled={submitting}>
                    Cancel
                </Button>
                <FormSubmitButton data-testid="palette-submit-btn" loading={submitting} isMobile={props.isMobile}>
                    {isNew ? 'Add palette' : 'Save changes'}
                </FormSubmitButton>
            </Group>
        </form>
    );
});

export default PaletteForm;
