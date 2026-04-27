import { Skeleton, Table } from '@mantine/core';

interface TableSkeletonRowsProps {
  rows?: number;
  widths: number[];
}

export function TableSkeletonRows({ rows = 4, widths }: TableSkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <Table.Tr key={i}>
          {widths.map((w, j) => (
            <Table.Td key={j}>
              {w > 0 && <Skeleton height={14} width={w} />}
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  );
}
