import { Container, Table, Text } from "@mantine/core";
import { useContext } from "react";
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
    onClicked: (uuid: string) => void;
}

function TableWithTrailingButton(props: ITableProps) {
    let isMobile = useContext(IsMobileContext);

    const rows = props.dataRows.map((d) => (
        <Table.Tr key={d.uuid} onClick={() => props.onClicked(d.uuid)}>
            {getNameTd(d.name, d.status, d.statusColor)}
            <Table.Td>{d.secondColString}</Table.Td>
            {!isMobile && <Table.Td>{d.thirdColString}</Table.Td>}
        </Table.Tr>
    ));

    const table = <Table verticalSpacing="xs" highlightOnHover={true}>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>{props.dataCols[0]}</Table.Th>
                <Table.Th>{props.dataCols[1]}</Table.Th>
                {!isMobile && <Table.Th>{props.dataCols[2]}</Table.Th>}
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {rows}
        </Table.Tbody>
    </Table>;
    
    if (isMobile) {
        return table;
    } else {
        return <Container>{table}</Container>;
    }
}

function getNameTd(name: string, status: string, statusColor: string) {
    return <Table.Td>
        <Text>{name}</Text>
        <Text c={statusColor} size="sm">{status}</Text>
    </Table.Td>;
}

export default TableWithTrailingButton;