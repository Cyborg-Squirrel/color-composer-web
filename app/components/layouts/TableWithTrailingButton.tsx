import { Button, Menu, Table, Text } from "@mantine/core";
import { useContext, useState, type ReactNode } from "react";
import { IsMobileContext } from "~/context/IsMobileContext";

interface IDataRow {
    name: string;
    uuid: string;
    status: string;
    statusColor: string;
    secondColString: string;
    thirdColString: string;
}

interface ITableProps {
    dataRows: IDataRow[];
    dataCols: string[];
    onEditClicked: (clientUuid: string) => void;
    onDeleteClicked: (clientUuid: string) => void;
}

export function TableWithTrailingButton(props: ITableProps) {
    let isMobile = useContext(IsMobileContext);
    const [hoveredRow, setHoveredRow] = useState("");
    const [menuOpenRow, setMenuOpenRow] = useState("");

    const rows = props.dataRows.map((d) => (
        <Table.Tr key={d.uuid} onMouseEnter={() => setHoveredRow(d.uuid)} onMouseLeave={() => setHoveredRow("")}>
            {getClientNameTd(d.name, d.status, d.statusColor)}
            <Table.Td>{d.secondColString}</Table.Td>
            {!isMobile && <Table.Td>{d.thirdColString}</Table.Td>}
            {!isMobile && getEditButtonTd(() => setMenuOpenRow(d.uuid), () => setMenuOpenRow(""), menuOpenRow == d.uuid || hoveredRow == d.uuid)}
        </Table.Tr>
    ));

    return (
        <Table verticalSpacing="xs" highlightOnHover={false}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>{props.dataCols[0]}</Table.Th>
                    <Table.Th>{props.dataCols[1]}</Table.Th>
                    {!isMobile && <Table.Th>{props.dataCols[2]}</Table.Th>}
                    {!isMobile && <Table.Th />}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {rows}
            </Table.Tbody>
        </Table>
    );
}

function getEditButtonTd(onOpen: () => void, onClose: () => void, visible: boolean): ReactNode {
    return <Table.Td>
        <Menu shadow="md" width="8em" position="bottom-end" closeOnItemClick onClose={onClose} onOpen={onOpen}>
            <Menu.Target>
                <Button variant="subtle" size="sm" color="var(--mantine-color-text)">
                    <Text c={visible ? undefined : 'transparent'} fw={700}>...</Text>
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item>Edit</Menu.Item>
                <Menu.Item>Delete</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </Table.Td>;
}

function getClientNameTd(name: string, status: string, statusColor: string) {
    return <Table.Td>
        <Text>{name}</Text>
        <Text c={statusColor} size="sm">{status}</Text>
    </Table.Td>;
}