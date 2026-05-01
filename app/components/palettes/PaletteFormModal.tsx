import { Button, Group, Modal, useModalsStack } from "@mantine/core";
import { useRef } from "react";
import type { IPalette } from "~/api/palettes/palettes_api";
import { usePaletteApi } from "~/provider/PaletteApiContext";
import PaletteForm, { type IPaletteFormHandle } from "./PaletteForm";

interface IPaletteFormModalProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isMobile: boolean;
    palette: IPalette | undefined;
    title: string;
}

function PaletteFormModal({ opened, onClose, onSuccess, isMobile, palette, title }: IPaletteFormModalProps) {
    const stack = useModalsStack(['first', 'second']);
    const formRef = useRef<IPaletteFormHandle>(null);
    const paletteApi = usePaletteApi();

    const handleDelete = async () => {
        if (!palette) return;
        try {
            await paletteApi.deletePalette(palette.uuid);
            onClose();
            onSuccess();
        } catch (err) {
            console.error('Error deleting palette', err);
        }
    };

    const handleClose = () => {
        if (formRef.current?.isSubmitting() ?? false) return;
        if (formRef.current?.isDirty() ?? false) {
            stack.open('second');
        } else {
            onClose();
        }
    };

    const closePendingChangesModal = (closeForm: boolean) => {
        stack.close('second');
        if (closeForm) onClose();
    };

    return (
        <>
            <Modal
                {...stack.register('first')}
                radius="md"
                size="md"
                fullScreen={isMobile}
                opened={opened}
                onClose={handleClose}
                closeButtonProps={{ size: 'lg' }}
                title={title}
            >
                <PaletteForm
                    palette={palette}
                    isMobile={isMobile}
                    closeForm={handleClose}
                    onSuccess={onSuccess}
                    onDelete={palette ? handleDelete : undefined}
                    ref={formRef}
                />
            </Modal>
            <Modal
                {...stack.register('second')}
                radius="md"
                size="md"
                fullScreen={isMobile}
                opened={stack.state.second}
                onClose={() => closePendingChangesModal(false)}
                closeButtonProps={{ size: 'lg' }}
                title={<div style={{ fontWeight: 'bold' }}>Unsaved changes</div>}
            >
                Are you sure you want to discard your changes?
                <Group mt="lg" justify="flex-end">
                    <Button id="palette-discard-btn" variant="default" onClick={() => closePendingChangesModal(true)}>Discard</Button>
                    <Button id="palette-keep-editing-btn" variant="primary" onClick={() => closePendingChangesModal(false)}>Keep Editing</Button>
                </Group>
            </Modal>
        </>
    );
}

export default PaletteFormModal;
