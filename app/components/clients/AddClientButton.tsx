import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import { IsMobileContext } from "~/context/ui/IsMobileContext";
import ClientFormModal from "./ClientFormModal";

interface IAddClientButtonProps {
    onSuccess?: () => void;
}

function AddClientButton({ onSuccess }: IAddClientButtonProps) {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = useContext(IsMobileContext);

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
        <Button onClick={open}>Add Client</Button>
    </>)
}

export default AddClientButton;