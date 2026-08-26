import { Box, Typography } from '@mui/material'

interface TitleProps {
  titleText: string
}

function Title({ titleText }: TitleProps) {
  return (
    <Box sx={{ flexShrink: 0, bgcolor: 'var(--color-neutral-muted)', p: 2, borderRadius: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {titleText}
      </Typography>
    </Box>
  )
}

export default Title
