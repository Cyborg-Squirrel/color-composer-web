import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PlusIcon } from "@phosphor-icons/react";
import { isMobileUi } from "~/components/util/IsMobile";
import ClientFormModal from "./ClientFormModal";

interface IAddClientButtonProps {
    onSuccess?: () => void;
}

function AddClientButton({ onSuccess }: IAddClientButtonProps) {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = isMobileUi();

    const handleSuccess = () => {
        close();
        onSuccess?.();
    };

    return (<>
        <ClientFormModal
            opened={modalOpened}
            onClose={close}
            onSuccess={handleSuccess}
            isMobile={isMobile}
            client={undefined}
            strips={[]}
            title='Add Client'
        />
        <Button data-testid="add-client-btn" leftSection={<PlusIcon size={12} />} onClick={open}>
            Add Client
        </Button>
    </>)
}

export default AddClientButton;