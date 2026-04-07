import { Button, Group, Modal, useModalsStack } from "@mantine/core";
import { useRef } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import ClientForm, { type IClientFormHandle } from "./ClientForm";

interface IClientFormModalProps {
    opened: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isMobile: boolean;
    client: ILedStripClient | undefined;
    strips: ILedStrip[];
    title: string;
}

function ClientFormModal({ opened, onClose, onSuccess, isMobile, client, strips, title }: IClientFormModalProps) {
    const stack = useModalsStack(['first', 'second']);
    const formRef = useRef<IClientFormHandle>(null);

    const handleClose = () => {
        if (formRef.current?.isSubmitting() ?? false) {
            return;
        }
        if (formRef.current?.isDirty() ?? false) {
            stack.open('second');
        } else {
            onClose();
        }
    };

    const closePendingChangesModal = (closeForm: boolean) => {
        stack.close('second');
        if (closeForm) {
            onClose();
        }
    };

    return (
        <>
            <Modal
                {...stack.register('first')}
                radius="md"
                size="lg"
                fullScreen={isMobile}
                opened={opened}
                onClose={handleClose}
                closeButtonProps={{ size: 'lg' }}
                title={title}
            >
                <ClientForm
                    client={client}
                    strips={strips}
                    isMobile={isMobile}
                    closeForm={handleClose}
                    onSuccess={onSuccess}
                    ref={formRef}
                />
            </Modal>
            <Modal
                {...stack.register('second')}
                radius="md"
                size="lg"
                fullScreen={isMobile}
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

export default ClientFormModal;
