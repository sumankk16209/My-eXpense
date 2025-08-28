import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 6 }}>
        <Typography variant="h1" component="h1" gutterBottom color="primary">
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            size="large"
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => navigate('/expenses')}
            size="large"
          >
            View Expenses
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default NotFoundPage;
