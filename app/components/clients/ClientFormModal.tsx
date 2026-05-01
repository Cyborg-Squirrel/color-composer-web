import { Button, Group, Modal, useModalsStack } from "@mantine/core";
import { useRef } from "react";
import type { ILedStripClient } from "~/api/clients/clients_api";
import type { ILedStrip } from "~/api/strips/strips_api";
import { useClientApi } from "~/provider/ClientApiContext";
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
    const stack = useModalsStack(['first', 'second', 'third']);
    const formRef = useRef<IClientFormHandle>(null);
    const clientApi = useClientApi();

    const handleDelete = () => {
        if (!client) return;
        stack.open('third');
    };

    const confirmDelete = async () => {
        if (!client) return;
        stack.close('third');
        try {
            await clientApi.deleteClient(client.uuid);
            onClose();
            onSuccess();
        } catch (err) {
            console.error('Error deleting client', err);
        }
    };

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
                    onDelete={client ? handleDelete : undefined}
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
                    <Button data-testid="client-discard-btn" variant="default" onClick={() => closePendingChangesModal(true)}>Discard</Button>
                    <Button data-testid="client-keep-editing-btn" variant="primary" onClick={() => closePendingChangesModal(false)}>Keep Editing</Button>
                </Group>
            </Modal>
            <Modal
                {...stack.register('third')}
                radius="md"
                size="sm"
                opened={stack.state.third}
                onClose={() => stack.close('third')}
                title={<div style={{ fontWeight: 'bold' }}>Delete client</div>}
            >
                Are you sure you want to delete this client? This cannot be undone.
                <Group mt="lg" justify="flex-end">
                    <Button data-testid="client-delete-cancel-btn" variant="default" onClick={() => stack.close('third')}>Cancel</Button>
                    <Button data-testid="client-delete-confirm-btn" color="red" onClick={confirmDelete}>Delete</Button>
                </Group>
            </Modal>
        </>
    );
}

export default ClientFormModal;
