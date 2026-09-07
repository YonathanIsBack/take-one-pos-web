import { Box, Typography } from '@mui/material';

interface TitleProps {
  titleText: string;
}

function Title({ titleText }: TitleProps) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        bgcolor: 'var(--color-neutral-muted)',
        py: 2.5,
        px: 3,
        borderLeft: '4px solid var(--color-secondary)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {titleText}
      </Typography>
    </Box>
  );
}

export default Title;
