import { Modal } from "@mantine/core";
import { useRef } from "react";
import type { ILedStripClient } from "~/api/clients_api";
import type { ILedStrip } from "~/api/strips_api";
import ClientForm, { type IClientFormHandle } from "./ClientForm";

interface IClientFormModalProps {
    opened: boolean;
    onClose: () => void;
    isMobile: boolean;
    client: ILedStripClient | undefined;
    strips: ILedStrip[];
    title: string;
}

function ClientFormModal(props: IClientFormModalProps) {
    const formRef = useRef<IClientFormHandle>(null);

    const handleClose = () => {
        if (formRef.current?.isDirty() ?? false) {
            // TODO Mantine confirmation dialog
            if (confirm("You have unsaved changes. Are you sure you want to close?")) {
                props.onClose();
            }
        } else {
            props.onClose();
        }
    };

    return (
        <Modal
            radius="md"
            size="lg"
            fullScreen={props.isMobile}
            opened={props.opened}
            onClose={handleClose}
            closeButtonProps={{ size: 'lg' }}
            title={props.title}
        >
            <ClientForm
                client={props.client}
                strips={props.strips}
                isMobile={props.isMobile}
                closeForm={props.onClose}
                ref={formRef}
            />
        </Modal>
    );
}

export default ClientFormModal;
