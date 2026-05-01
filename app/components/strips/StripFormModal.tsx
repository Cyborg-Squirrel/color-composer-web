import { Button, Group, Modal, useModalsStack } from "@mantine/core";
import { useRef } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { useStripApi } from "~/provider/StripApiContext";
import StripForm, { type IStripFormHandle } from "./StripForm";

interface IStripFormModalProps {
    opened: boolean;
    onClose: () => void;
    isMobile: boolean;
    strip: ILedStrip | undefined;
    clients: ILedStripClient[];
    title: string;
    onSuccess: () => void;
}

function StripFormModal(props: IStripFormModalProps) {
    const stack = useModalsStack(['first', 'second', 'third']);
    const formRef = useRef<IStripFormHandle>(null);
    const stripApi = useStripApi();

    const handleDelete = () => {
        if (!props.strip) return;
        stack.open('third');
    };

    const confirmDelete = async () => {
        if (!props.strip) return;
        stack.close('third');
        try {
            await stripApi.deleteStrip(props.strip.uuid);
            props.onClose();
            props.onSuccess();
        } catch (err) {
            console.error('Error deleting strip', err);
        }
    };

    const handleClose = () => {
        if (formRef.current?.isDirty() ?? false) {
            stack.open('second');
        } else {
            props.onClose();
        }
    };

    const closePendingChangesModal = (closeForm: boolean) => {
        stack.close('second');
        if (closeForm) {
            props.onClose();
        }
    };

    return (
        <>
            <Modal
                {...stack.register('first')}
                radius="md"
                size="lg"
                fullScreen={props.isMobile}
                opened={props.opened}
                onClose={handleClose}
                closeButtonProps={{ size: 'lg' }}
                title={props.title}
            >
                <StripForm
                    strip={props.strip}
                    clients={props.clients}
                    isMobile={props.isMobile}
                    closeForm={handleClose}
                    onSuccess={props.onSuccess}
                    onDelete={props.strip ? handleDelete : undefined}
                    ref={formRef}
                />
            </Modal>
            <Modal
                {...stack.register('second')}
                radius="md"
                size="lg"
                fullScreen={props.isMobile}
                opened={stack.state.second}
                onClose={() => closePendingChangesModal(false)}
                closeButtonProps={{ size: 'lg' }}
                title={<div style={{ fontWeight: 'bold' }}>Unsaved changes</div>}
            >
                Are you sure you want to discard your changes?
                <Group mt="lg" justify="flex-end">
                    <Button id="strip-discard-btn" variant="default" onClick={() => closePendingChangesModal(true)}>Discard</Button>
                    <Button id="strip-keep-editing-btn" variant="primary" onClick={() => closePendingChangesModal(false)}>Keep Editing</Button>
                </Group>
            </Modal>
            <Modal
                {...stack.register('third')}
                radius="md"
                size="sm"
                opened={stack.state.third}
                onClose={() => stack.close('third')}
                title={<div style={{ fontWeight: 'bold' }}>Delete strip</div>}
            >
                Are you sure you want to delete this strip? This cannot be undone.
                <Group mt="lg" justify="flex-end">
                    <Button id="strip-delete-cancel-btn" variant="default" onClick={() => stack.close('third')}>Cancel</Button>
                    <Button id="strip-delete-confirm-btn" color="red" onClick={confirmDelete}>Delete</Button>
                </Group>
            </Modal>
        </>
    );
}

export default StripFormModal;
