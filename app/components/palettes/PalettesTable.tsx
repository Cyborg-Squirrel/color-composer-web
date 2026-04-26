import { Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import type { IPalette } from "~/api/palettes/palettes_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { usePaletteApi } from "~/provider/PaletteApiContext";
import { TableSkeletonRows } from "../util/TableSkeletonRows";
import PaletteFormModal from "./PaletteFormModal";

function ColorStrip({ colors }: { colors: string[] }) {
    if (!colors || colors.length === 0) return null;
    return (
        <div style={{ display: 'flex', height: 18, borderRadius: 3, overflow: 'hidden', width: 80 }}>
            {colors.map((c, i) => (
                <div key={i} style={{ flex: 1, background: c }} />
            ))}
        </div>
    );
}

interface IPalettesTableProps {
    refreshKey: number;
    onPaletteMutated: () => void;
}

export function PalettesTable({ refreshKey, onPaletteMutated }: IPalettesTableProps) {
    const paletteApi = usePaletteApi();
    const [palettes, setPalettes] = useState<IPalette[] | undefined>(undefined);
    const [selectedUuid, setSelectedUuid] = useState<string>('');
    const [modalOpened, { open, close }] = useDisclosure(false);
    const isMobile = isMobileUi();

    useEffect(() => {
        setPalettes(undefined);
        paletteApi.getPalettes()
            .then(setPalettes)
            .catch(err => console.error('Error fetching palettes', err));
    }, [refreshKey, paletteApi]);

    const loading = palettes === undefined;

    const handleRowClick = (uuid: string) => {
        setSelectedUuid(uuid);
        open();
    };

    const handleSuccess = () => {
        close();
        onPaletteMutated();
    };

    const selectedPalette = palettes?.find(p => p.uuid === selectedUuid);

    return (
        <>
            <PaletteFormModal
                opened={modalOpened}
                onClose={close}
                onSuccess={handleSuccess}
                isMobile={isMobile}
                palette={selectedPalette}
                title="Edit Palette"
            />
            <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Type</Table.Th>
                        {!isMobile && <Table.Th>Colors</Table.Th>}
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loading ? (
                        <TableSkeletonRows widths={isMobile ? [140, 80] : [140, 80, 80]} />
                    ) : palettes.map(p => {
                        const colors = (p.settings?.colors as string[]) ?? [];
                        return (
                            <Table.Tr
                                key={p.uuid}
                                onClick={() => handleRowClick(p.uuid)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Table.Td><Text fw={500}>{p.name}</Text></Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="dimmed">{p.type}</Text>
                                </Table.Td>
                                {!isMobile && (
                                    <Table.Td>
                                        <ColorStrip colors={colors} />
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        );
                    })}
                    {!loading && palettes.length === 0 && (
                        <Table.Tr>
                            <Table.Td colSpan={isMobile ? 2 : 3} ta="center" py="xl" c="dimmed">
                                No palettes configured
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </>
    );
}
