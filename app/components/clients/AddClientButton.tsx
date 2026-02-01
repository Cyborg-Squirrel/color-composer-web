import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import { IsMobileContext } from "~/context/IsMobileContext";
import ClientForm from "./ClientForm";

function AddClientButton() {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = useContext(IsMobileContext);

    return (<>
        <Modal radius="md" size="lg" fullScreen={isMobile} opened={modalOpened}
            onClose={close} closeButtonProps={{ size: 'lg' }} title='Add Client'>
            <ClientForm strips={[]} isMobile={isMobile} onSubmit={close} client={undefined} />
        </Modal>
        <Button onClick={open}>Add Client</Button>
    </>)
}

export default AddClientButton;