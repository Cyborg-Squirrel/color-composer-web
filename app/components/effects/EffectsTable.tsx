import { ActionIcon, Checkbox, Container, Table, Text, Tooltip } from "@mantine/core";
import { PauseIcon, PlayIcon, TrashIcon } from '@phosphor-icons/react';
import { useEffect, useState } from "react";
import type { ILightEffect, LightEffectStatusCommand } from "~/api/effects/effects_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { useEffectApi } from "~/provider/EffectApiContext";
import { usePaletteApi } from "~/provider/PaletteApiContext";
import BoundedLoadingOverlay from "../controls/BoundedLoadingOverlay";
import MediaControlAffix from "../controls/MediaControlAffix";

interface IEffectsTableProps {
}

function EffectsTable({ }: IEffectsTableProps) {
    const effectApi = useEffectApi();
    const paletteApi = usePaletteApi();
    const [effects, setEffects] = useState<ILightEffect[] | undefined>(undefined);
    const [palettes, setPalettes] = useState<Map<string, string>>(new Map());
    const [checkedEffects, setCheckedEffects] = useState<Set<string>>(new Set());
    const [hoveredRowUuid, setHoveredRowUuid] = useState<string | null>(null);
    const isMobile = isMobileUi();

    useEffect(() => {
        setEffects(undefined);
        Promise.all([
            effectApi.getEffects() || Promise.resolve([]),
            paletteApi.getPalettes() || Promise.resolve([])
        ])
            .then(([fetchedEffects, fetchedPalettes]) => {
                setEffects(fetchedEffects);
                const paletteMap = new Map(fetchedPalettes.map(p => [p.uuid, p.name]));
                setPalettes(paletteMap);
            })
            .catch(err => {
                console.error('Error fetching data', err);
            });
    }, [effectApi, paletteApi]);

    if (effects === undefined) {
        return <BoundedLoadingOverlay loading={true} />;
    }

    const handlePlayPause = async (effectUuid: string, currentStatus: string) => {
        const command: LightEffectStatusCommand = currentStatus === 'Playing' ? 'Pause' : 'Play';
        try {
            await effectApi.updateEffectStatus([effectUuid], command);
            // Update local state
            setEffects(prevEffects => prevEffects?.map(e =>
                e.uuid === effectUuid
                    ? { ...e, status: command === 'Play' ? 'Playing' : 'Paused' }
                    : e
            ));
        } catch (err) {
            console.error('Error updating effect status', err);
        }
    };

    const handleCheckboxChange = (effectUuid: string) => {
        const newChecked = new Set(checkedEffects);
        if (newChecked.has(effectUuid)) {
            newChecked.delete(effectUuid);
        } else {
            newChecked.add(effectUuid);
        }
        setCheckedEffects(newChecked);
    };

    const handleBulkPlay = async () => {
        if (checkedEffects.size === 0) return;
        try {
            await effectApi.updateEffectStatus(Array.from(checkedEffects), 'Play');
            setEffects(prevEffects => prevEffects?.map(e =>
                checkedEffects.has(e.uuid) ? { ...e, status: 'Playing' } : e
            ));
        } catch (err) {
            console.error('Error playing effects', err);
        }
    };

    const handleBulkPause = async () => {
        if (checkedEffects.size === 0) return;
        try {
            await effectApi.updateEffectStatus(Array.from(checkedEffects), 'Pause');
            setEffects(prevEffects => prevEffects?.map(e =>
                checkedEffects.has(e.uuid) ? { ...e, status: 'Paused' } : e
            ));
        } catch (err) {
            console.error('Error pausing effects', err);
        }
    };

    const handleDelete = async (effectUuid: string) => {
        try {
            await effectApi.deleteEffect(effectUuid);
            setEffects(prevEffects => prevEffects?.filter(e => e.uuid !== effectUuid));
            setCheckedEffects(prev => {
                const newChecked = new Set(prev);
                newChecked.delete(effectUuid);
                return newChecked;
            });
        } catch (err) {
            console.error('Error deleting effect', err);
        }
    };

    const hasAnyChecked = checkedEffects.size > 0;

    const rows = effects.map((effect) => (
        <Table.Tr
            key={effect.uuid}
            onMouseEnter={() => setHoveredRowUuid(effect.uuid)}
            onMouseLeave={() => setHoveredRowUuid(null)}
        >
            <Table.Td width="60px">
                <ActionIcon
                    variant="subtle"
                    onClick={() => handlePlayPause(effect.uuid, effect.status)}
                    opacity={isMobile || checkedEffects.has(effect.uuid) || hoveredRowUuid === effect.uuid ? 1 : 0}
                >
                    {effect.status === 'Playing' ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                </ActionIcon>
            </Table.Td>
            <Table.Td>
                <Text fw={500}>{effect.name}</Text>
                <Text size="sm" c="dimmed">{effect.type}</Text>
            </Table.Td>
            {!isMobile && <Table.Td>{palettes.get(effect.paletteUuid ?? '') || 'None'}</Table.Td>}
            <Table.Td width="60px" style={{ textAlign: 'center' }}>
                <Tooltip label="Delete effect">
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => handleDelete(effect.uuid)}
                    >
                        <TrashIcon size={16} />
                    </ActionIcon>
                </Tooltip>
            </Table.Td>
            <Table.Td
                width="60px"
                style={{
                    textAlign: 'center',
                    opacity: isMobile || checkedEffects.has(effect.uuid) || hoveredRowUuid === effect.uuid ? 1 : 0,
                }}
            >
                <Checkbox
                    checked={checkedEffects.has(effect.uuid)}
                    onChange={() => handleCheckboxChange(effect.uuid)}
                    aria-label={`Select ${effect.name}`}
                    size="md"
                    styles={{
                        input: {
                            borderWidth: '3px',
                        }
                    }}
                />
            </Table.Td>
        </Table.Tr>
    ));

    const table = (
        <Table verticalSpacing="xs" highlightOnHover={true}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th />
                    <Table.Th>Name</Table.Th>
                    {!isMobile && <Table.Th>Palette</Table.Th>}
                    <Table.Th />
                    <Table.Th />
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    );

    return (
        <>
            <MediaControlAffix show={hasAnyChecked} />
            {isMobile ? table : <Container>{table}</Container>}
        </>
    );
}

export default EffectsTable;
