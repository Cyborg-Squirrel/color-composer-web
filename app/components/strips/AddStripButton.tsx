import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import type { ILedStripClient } from "~/api/clients_api";
import { IsMobileContext } from "~/context/IsMobileContext";
import StripFormModal from "./StripFormModal";

interface IAddStripButtonProps {
    clients: ILedStripClient[];
    onSuccess?: () => void;
}

function AddStripButton({ clients, onSuccess }: IAddStripButtonProps) {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = useContext(IsMobileContext);

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
