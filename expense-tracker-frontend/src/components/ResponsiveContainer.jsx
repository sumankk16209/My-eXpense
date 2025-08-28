import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'lg',
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
