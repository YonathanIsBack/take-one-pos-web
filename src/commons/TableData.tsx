import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Column } from '../constants/Type';
import TableRowAction from './TableRowAction';
import TableRowDate from './TableRowDate';
import TableRowText from './TableRowText';

interface TableDataProps<T> {
  url: string;
  columns: Column[];
  onDetail?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  dataKey: keyof T;
}

function convertToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function TableData<T extends Record<string, unknown>>({
  url,
  columns,
  onDetail,
  onEdit,
  onDelete,
  dataKey,
}: TableDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json.items);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const renderCell = (column: Column, item: T) => {
    const camelCaseKey = convertToCamelCase(column.columName) as keyof T;
    const value = item[camelCaseKey];
    const alignment = column.alignment?.toLowerCase() as 'left' | 'right' | 'center';

    switch (column.columnType) {
      case 'TEXT':
        return <TableRowText value={String(value ?? '')} alignment={alignment} />;
      case 'DATE':
        return <TableRowDate value={String(value ?? '')} alignment={alignment} />;
      case 'ACTION':
        return (
          <TableRowAction
            detail={column.option?.detail}
            edit={column.option?.edit}
            delete={column.option?.delete}
            onDetail={() => onDetail?.(item)}
            onEdit={() => onEdit?.(item)}
            onDelete={() => onDelete?.(item)}
            alignment={alignment}
          />
        );
      default:
        return <TableCell align={alignment}>{String(value ?? '')}</TableCell>;
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TableContainer sx={{ flex: '0 0 auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--color-secondary)' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.columName}
                  align="center"
                  sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TableContainer>
          <Table>
            <TableBody>
              {data.map((item) => (
                <TableRow key={String(item[dataKey])}>
                  {columns.map((column) => renderCell(column, item))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default TableData;
