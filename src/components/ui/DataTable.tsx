import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Box } from '@chakra-ui/react';
import { useState } from 'react';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  pagination?: boolean;
  selectable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onRowSelect?: (selectedRows: any[]) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  pagination,
  selectable,
  onSort,
  onPageChange,
  onRowSelect,
}) => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSort = (key: string) => {
    onSort?.(key, 'asc');
  };

  const handleSelect = (row: any) => {
    const newSelection = selectedRows.includes(row)
      ? selectedRows.filter(r => r !== row)
      : [...selectedRows, row];
    setSelectedRows(newSelection);
    onRowSelect?.(newSelection);
  };

  return (
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            {selectable && <Th></Th>}
            {columns.map(column => (
              <Th
                key={column.key}
                onClick={() => handleSort(column.key)}
                cursor={onSort ? 'pointer' : 'default'}
              >
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr key={index}>
              {selectable && (
                <Td>
                  <Checkbox
                    isChecked={selectedRows.includes(row)}
                    onChange={() => handleSelect(row)}
                  />
                </Td>
              )}
              {columns.map(column => (
                <Td key={column.key}>{row[column.key]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
