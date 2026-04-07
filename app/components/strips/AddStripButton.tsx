import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ILedStripClient } from "~/api/clients/clients_api";
import { isMobileUi } from "~/util/IsMobile";
import StripFormModal from "./StripFormModal";

interface IAddStripButtonProps {
    clients: ILedStripClient[];
    onSuccess?: () => void;
}

function AddStripButton({ clients, onSuccess }: IAddStripButtonProps) {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = isMobileUi();

    const handleSuccess = () => {
        close();
        onSuccess?.();
    };

    return (<>
        <StripFormModal
            opened={modalOpened}
            onClose={close}
            isMobile={isMobile}
            strip={undefined}
            clients={clients}
            title='Add Strip'
            onSuccess={handleSuccess}
        />
        <Button onClick={open}>Add Strip</Button>
    </>)
}

export default AddStripButton;
