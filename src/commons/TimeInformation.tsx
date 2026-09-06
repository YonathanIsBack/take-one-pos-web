import { Box, Divider, Typography } from '@mui/material';

interface TimeInformationProps {
  createdAt: string;
  updatedAt: string | null;
}

function TimeInformation({ createdAt, updatedAt }: TimeInformationProps) {
  return (
    <>
      <Divider sx={{ my: 2 }}>
        <Typography variant="caption" sx={{ color: 'grey.500' }}>
          Time Information
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
            Created At
          </Typography>
          <Typography variant="body1">
            {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mb: 0.5 }}>
            Updated At
          </Typography>
          <Typography variant="body1">
            {updatedAt ? new Date(updatedAt).toLocaleDateString() : '-'}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default TimeInformation;
