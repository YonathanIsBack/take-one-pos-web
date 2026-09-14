import { Box, Link, SxProps, TableCell } from '@mui/material';
import { useState } from 'react';

interface TableRowImageProps {
  value: string;
  src: string;
  sx?: SxProps;
}

function TableRowImage({ value, src, sx }: TableRowImageProps) {
  const [hover, setHover] = useState(false);

  return (
    <TableCell sx={{ ...sx, position: 'relative' }}>
      <Link
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{ cursor: 'pointer', position: 'relative' }}
      >
        {value}
        {hover && (
          <Box
            component="img"
            src={src}
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              maxWidth: 200,
              maxHeight: 200,
              border: '1px solid #ccc',
              borderRadius: 1,
              bgcolor: 'white',
              boxShadow: 2,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}
      </Link>
    </TableCell>
  );
}

export default TableRowImage;
