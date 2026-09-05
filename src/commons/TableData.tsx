import {
  Box,
  CircularProgress,
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
import fetchWithAuth from '../utils/fetchWithAuth';
import TableRowAction from './TableRowAction';
import TableRowCurrency from './TableRowCurrency';
import TableRowDate from './TableRowDate';
import TableRowText from './TableRowText';
import ColumnType from '../constants/ColumnType';

interface TableDataProps<T> {
  url: string;
  columns: Column[];
  onDetail?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  dataKey: keyof T;
  disabled?: boolean;
  refreshKey?: number;
  responseKey?: string;
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
  disabled,
  refreshKey,
  responseKey = 'items',
}: TableDataProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json[responseKey]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      });
  }, [url, refreshKey, responseKey]);

  if (loading) {
    return (
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const renderCell = (column: Column, item: T, width: string) => {
    const camelCaseKey = convertToCamelCase(column.columName);
    const source = column.parentKey ? (item[column.parentKey] as Record<string, unknown>) : item;
    const value = source?.[camelCaseKey];
    const alignment = column.alignment?.toLowerCase() as 'left' | 'right' | 'center';

    switch (column.columnType) {
      case ColumnType.TEXT:
        return <TableRowText value={String(value ?? '')} alignment={alignment} sx={{ width }} />;
      case ColumnType.DATE:
        return <TableRowDate value={String(value ?? '')} alignment={alignment} sx={{ width }} />;
      case ColumnType.ACTION:
        return (
          <TableRowAction
            detail={column.option?.detail}
            edit={column.option?.edit}
            delete={column.option?.delete}
            onDetail={() => onDetail?.(item)}
            onEdit={() => onEdit?.(item)}
            onDelete={() => onDelete?.(item)}
            alignment={alignment}
            sx={{ width }}
          />
        );
      case ColumnType.CURRENCY:
        return <TableRowCurrency value={value as string | number} sx={{ width }} />;
      default:
        return <TableCell align={alignment} sx={{ width }}>{String(value ?? '')}</TableCell>;
    }
  };

  const columnWidth = `${100 / columns.length}%`;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      {disabled && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <TableContainer sx={{ flex: '0 0 auto' }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--color-secondary)' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.columName}
                  align="center"
                  sx={{ fontWeight: 'bold', fontSize: '1.1rem', width: columnWidth }}
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
          <Table sx={{ tableLayout: 'fixed' }}>
            <TableBody>
              {data.map((item) => (
                <TableRow key={String(item[dataKey])}>
                  {columns.map((column) => renderCell(column, item, columnWidth))}
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
