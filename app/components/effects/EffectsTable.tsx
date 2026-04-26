import { ActionIcon, Button, Checkbox, Group, Modal, Pagination, Table, Text } from "@mantine/core";
import { ArrowDownIcon, ArrowUpIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react';
import { useEffect, useState } from "react";
import type { ILightEffect, LightEffectStatusCommand } from "~/api/effects/effects_api";
import { isMobileUi } from "~/components/util/IsMobile";
import { useEffectApi } from "~/provider/EffectApiContext";
import { usePaletteApi } from "~/provider/PaletteApiContext";
import MediaControlAffix from "../controls/MediaControlAffix";
import { TableSkeletonRows } from "../util/TableSkeletonRows";

function EffectsTable() {
    const effectApi = useEffectApi();
    const paletteApi = usePaletteApi();
    const [effects, setEffects] = useState<ILightEffect[] | undefined>(undefined);
    const [palettes, setPalettes] = useState<Map<string, string>>(new Map());
    const [checkedEffects, setCheckedEffects] = useState<Set<string>>(new Set());
    const [hoveredRowUuid, setHoveredRowUuid] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [sortKey, setSortKey] = useState<'name' | 'palette'>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;
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

    const loading = effects === undefined;

    const handlePlayPause = async (effectUuid: string, currentStatus: string) => {
        const command: LightEffectStatusCommand = currentStatus === 'Playing' ? 'Pause' : 'Play';
        try {
            await effectApi.updateEffectStatus([effectUuid], command);
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

    const handleBulkStop = async () => {
        if (checkedEffects.size === 0) return;
        try {
            await effectApi.updateEffectStatus(Array.from(checkedEffects), 'Stop');
            setEffects(prevEffects => prevEffects?.map(e =>
                checkedEffects.has(e.uuid) ? { ...e, status: 'Stopped' } : e
            ));
        } catch (err) {
            console.error('Error stopping effects', err);
        }
    };

    const handleBulkDelete = async () => {
        if (checkedEffects.size === 0) return;
        try {
            await Promise.all(Array.from(checkedEffects).map(uuid => effectApi.deleteEffect(uuid)));
            setEffects(prevEffects => prevEffects?.filter(e => !checkedEffects.has(e.uuid)));
            setCheckedEffects(new Set());
        } catch (err) {
            console.error('Error deleting effects', err);
        }
    };

    const handleSort = (key: 'name' | 'palette') => {
        if (key === sortKey) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedEffects = effects ? [...effects].sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
        const pa = palettes.get(a.paletteUuid ?? '') ?? '';
        const pb = palettes.get(b.paletteUuid ?? '') ?? '';
        return pa.localeCompare(pb) * dir;
    }) : undefined;

    const totalPages = sortedEffects ? Math.ceil(sortedEffects.length / PAGE_SIZE) : 1;
    const pagedEffects = sortedEffects?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const hasAnyChecked = checkedEffects.size > 0;

    const count = checkedEffects.size;

    const selectedStatuses = [...new Set(
        effects?.filter(e => checkedEffects.has(e.uuid)).map(e => e.status) ?? []
    )];

    return (
        <>
            <Modal
                opened={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                title="Delete effects"
                radius="md"
                size="sm"
            >
                <Text size="sm" mb="xl">
                    Delete {count} {count === 1 ? 'effect' : 'effects'}? This cannot be undone.
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button color="red" onClick={() => { setConfirmDelete(false); handleBulkDelete(); }}>Delete</Button>
                </Group>
            </Modal>
            <MediaControlAffix
                show={hasAnyChecked}
                isMobile={isMobile}
                selectedStatuses={selectedStatuses}
                onPlay={handleBulkPlay}
                onPause={handleBulkPause}
                onStop={handleBulkStop}
                onDelete={() => setConfirmDelete(true)}
            />
            <Table verticalSpacing="xs" highlightOnHover={true}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th />
                        <Table.Th
                            onClick={() => handleSort('name')}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                            <Group gap={4} wrap="nowrap">
                                Name
                                {sortKey === 'name'
                                    ? (sortDir === 'asc' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />)
                                    : <ArrowUpIcon size={14} opacity={0.3} />}
                            </Group>
                        </Table.Th>
                        {!isMobile && (
                            <Table.Th
                                onClick={() => handleSort('palette')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                <Group gap={4} wrap="nowrap">
                                    Palette
                                    {sortKey === 'palette'
                                        ? (sortDir === 'asc' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />)
                                        : <ArrowUpIcon size={14} opacity={0.3} />}
                                </Group>
                            </Table.Th>
                        )}
                        <Table.Th />
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loading ? (
                        <TableSkeletonRows widths={isMobile ? [0, 140, 0] : [0, 140, 100, 0]} />
                    ) : pagedEffects!.map((effect) => (
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
                                    styles={{ input: { borderWidth: '3px' } }}
                                />
                            </Table.Td>
                        </Table.Tr>
                    ))}
                    {!loading && pagedEffects!.length === 0 && (
                        <Table.Tr>
                            <Table.Td colSpan={isMobile ? 3 : 4} ta="center" py="xl" c="dimmed">
                                No effects configured
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
            {!loading && (effects?.length ?? 0) > PAGE_SIZE && (
                <Group justify="center" mt="md">
                    <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
                </Group>
            )}
        </>
    );
}

export default EffectsTable;
