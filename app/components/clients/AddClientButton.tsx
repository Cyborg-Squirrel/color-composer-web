import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import { IsMobileContext } from "~/context/IsMobileContext";
import ClientFormModal from "./ClientFormModal";

function AddClientButton() {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = useContext(IsMobileContext);

    return (<>
        <ClientFormModal
            opened={modalOpened}
            onClose={close}
            isMobile={isMobile}
            client={undefined}
            strips={[]}
            title='Add Client'
        />
        <Button onClick={open}>Add Client</Button>
    </>)
}

export default AddClientButton;