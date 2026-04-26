import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isMobileUi } from "~/components/util/IsMobile";
import PaletteFormModal from "./PaletteFormModal";

interface IAddPaletteButtonProps {
    onSuccess?: () => void;
}

function AddPaletteButton({ onSuccess }: IAddPaletteButtonProps) {
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = isMobileUi();

    const handleSuccess = () => {
        close();
        onSuccess?.();
    };

    return (
        <>
            <PaletteFormModal
                opened={modalOpened}
                onClose={close}
                onSuccess={handleSuccess}
                isMobile={isMobile}
                palette={undefined}
                title="Add Palette"
            />
            <Button onClick={open}>Add Palette</Button>
        </>
    );
}

export default AddPaletteButton;
