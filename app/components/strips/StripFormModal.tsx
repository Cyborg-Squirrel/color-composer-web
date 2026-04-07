import { Button, Group, Modal, useModalsStack } from "@mantine/core";
import { useRef } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
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
    const stack = useModalsStack(['first', 'second']);
    const formRef = useRef<IStripFormHandle>(null);

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
                    <Button variant="default" onClick={() => closePendingChangesModal(true)}>Discard</Button>
                    <Button variant="primary" onClick={() => closePendingChangesModal(false)}>Keep Editing</Button>
                </Group>
            </Modal>
        </>
    );
}

export default StripFormModal;
