import { Box, Link, Popper, SxProps, TableCell } from '@mui/material';
import { useState } from 'react';

interface TableRowImageProps {
  value: string;
  src: string;
  sx?: SxProps;
}

function TableRowImage({ value, src, sx }: TableRowImageProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <TableCell sx={sx}>
      <Link
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
        sx={{ cursor: 'pointer' }}
      >
        {value}
      </Link>
      <Popper open={!!anchorEl} anchorEl={anchorEl} placement="top" sx={{ zIndex: 1300 }}>
        <Box
          component="img"
          src={src}
          sx={{
            maxWidth: 200,
            maxHeight: 200,
            border: '1px solid #ccc',
            borderRadius: 1,
            bgcolor: 'white',
            boxShadow: 2,
            pointerEvents: 'none',
          }}
        />
      </Popper>
    </TableCell>
  );
}

export default TableRowImage;
