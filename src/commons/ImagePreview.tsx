import { Box, Dialog } from '@mui/material';
import { useState } from 'react';

interface ImagePreviewProps {
  src: string;
  maxWidth?: number;
  maxHeight?: number;
}

function ImagePreview({ src, maxWidth = 300, maxHeight = 300 }: ImagePreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="img"
        src={src}
        onClick={() => setOpen(true)}
        sx={{
          maxWidth,
          maxHeight,
          border: '1px solid #ccc',
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 },
        }}
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
        <Box component="img" src={src} sx={{ maxWidth: '100%', maxHeight: '80vh' }} />
      </Dialog>
    </>
  );
}

export default ImagePreview;
