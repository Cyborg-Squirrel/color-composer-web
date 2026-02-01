import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useRef } from "react";
import { IsMobileContext } from "~/context/IsMobileContext";
import ClientForm, { type IClientFormHandle } from "./ClientForm";

function AddClientButton() {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = useContext(IsMobileContext);
    const formRef = useRef<IClientFormHandle>(null);

    return (<>
        <Modal radius="md" size="lg" fullScreen={isMobile} opened={modalOpened}
            onClose={() => {
                if (formRef.current?.isDirty() ?? false) {
                    if (confirm("You have unsaved changes. Are you sure you want to close?")) {
                        close();
                    }
                } else {
                    close();
                }
            }} closeButtonProps={{ size: 'lg' }} title='Add Client'>
            <ClientForm strips={[]} isMobile={isMobile} closeForm={close} client={undefined} ref={formRef} />
        </Modal>
        <Button onClick={open}>Add Client</Button>
    </>)
}

export default AddClientButton;