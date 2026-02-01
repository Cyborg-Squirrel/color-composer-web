import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useContext } from "react";
import { IsMobileContext } from "~/context/IsMobileContext";
import ClientForm from "./ClientForm";

function AddClientButton() {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = useContext(IsMobileContext);

    return (<>
        <ClientForm client={undefined} strips={[]} isMobile={isMobile} title={"Add Client"} opened={modalOpened} closeForm={close}/>
        <Button onClick={open}>Add Client</Button>
    </>)
}

export default AddClientButton;