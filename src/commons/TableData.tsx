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

  const totalFlex = columns.reduce((sum, col) => sum + (col.flex ?? 1), 0);

  const renderCell = (column: Column, item: T, flex: number, isLastColumn: boolean) => {
    const camelCaseKey = convertToCamelCase(column.columName);
    const source = column.parentKey ? (item[column.parentKey] as Record<string, unknown>) : item;
    const value = source?.[camelCaseKey];
    const alignment = column.alignment?.toLowerCase() as 'left' | 'right' | 'center';
    const widthPct = `${(flex / totalFlex) * 100}%`;
    const cellSx = {
      width: widthPct,
      borderRight: isLastColumn ? 'none' : '1px solid var(--color-neutral-muted)',
    };

    switch (column.columnType) {
      case ColumnType.TEXT:
        return <TableRowText value={String(value ?? '')} alignment={alignment} sx={cellSx} />;
      case ColumnType.DATE:
        return <TableRowDate value={String(value ?? '')} alignment={alignment} sx={cellSx} />;
      case ColumnType.ACTION: {
        const options = typeof column.option === 'function' ? column.option(item as Record<string, unknown>) : column.option;
        return (
          <TableRowAction
            detail={options?.detail}
            edit={options?.edit}
            delete={options?.delete}
            onDetail={() => onDetail?.(item)}
            onEdit={() => onEdit?.(item)}
            onDelete={() => onDelete?.(item)}
            alignment={alignment}
            sx={cellSx}
          />
        );
      }
      case ColumnType.CURRENCY:
        return <TableRowCurrency value={value as string | number} sx={cellSx} />;
      default:
        return <TableCell align={alignment} sx={cellSx}>{String(value ?? '')}</TableCell>;
    }
  };

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
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: 'var(--color-secondary)',
                position: 'sticky',
                top: 0,
                zIndex: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              {columns.map((column, colIndex) => {
                const flex = column.flex ?? 1;
                const isLastColumn = colIndex === columns.length - 1;
                return (
                  <TableCell
                    key={column.columName}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      letterSpacing: '0.03em',
                      color: 'var(--color-primary)',
                      width: `${(flex / totalFlex) * 100}%`,
                      borderRight: isLastColumn ? 'none' : '1px solid var(--color-neutral-muted)',
                    }}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={String(item[dataKey])}
                sx={{
                  bgcolor: index % 2 === 0 ? 'var(--color-white)' : 'var(--color-bg-warm)',
                  '&:hover': { bgcolor: 'var(--color-neutral-muted)' },
                  transition: 'background-color 0.15s ease',
                }}
              >
                {columns.map((column, colIndex) => renderCell(column, item, column.flex ?? 1, colIndex === columns.length - 1))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TableData;
