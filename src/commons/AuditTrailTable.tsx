import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';

interface AuditTrail {
  id: number;
  username: string;
  action: string;
  explanation: string;
  createdAt: string;
}

interface AuditTrailTableProps {
  url: string;
}

function AuditTrailTable({ url }: AuditTrailTableProps) {
  const [data, setData] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json.auditTrails);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch audit trails:', error);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'var(--color-secondary)' }}>
              {['Username', 'Action', 'Explanation', 'Created At'].map((label) => (
                <TableCell key={label} sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'var(--color-secondary)' }}>
            {['Username', 'Action', 'Explanation', 'Created At'].map((label) => (
              <TableCell key={label} sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">No audit trails found</TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: index % 2 === 0 ? 'var(--color-white)' : 'var(--color-bg-warm)',
                  '&:hover': { bgcolor: 'var(--color-neutral-muted)' },
                }}
              >
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{row.explanation}</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AuditTrailTable;
