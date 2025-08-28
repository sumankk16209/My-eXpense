import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
import { loginUser } from '../api';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { handleApiError, showSuccess } = useError();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert to form data format for OAuth2
      const formDataObj = new FormData();
      formDataObj.append('username', formData.username);
      formDataObj.append('password', formData.password);

      const response = await loginUser(formDataObj);
      
      // Login successful
      login(response);
      showSuccess('Login successful! Welcome back.');
      navigate('/');
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleSubmit(e),
        showDetails: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 4 }
      }}
    >
      <Box
        sx={{
          marginTop: { xs: 2, sm: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4 },
            width: '100%',
            maxWidth: { xs: '100%', sm: 400 },
            borderRadius: 3,
          }}
        >
          <Typography 
            component="h1" 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              fontWeight: 600
            }}
          >
            Login
          </Typography>
          
          <Typography 
            variant="body2" 
            align="center" 
            color="textSecondary" 
            sx={{ 
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Sign in to your expense tracker account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={isMobile ? 2 : 3}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                size={isMobile ? 'medium' : 'medium'}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: isMobile ? '48px' : '56px',
                  }
                }}
              />
              
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                size={isMobile ? 'medium' : 'medium'}
                sx={{
                  '& .MuiInputBase-root': {
                    minHeight: isMobile ? '48px' : '56px',
                  }
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size={isMobile ? 'large' : 'large'}
                sx={{
                  mt: { xs: 1, sm: 2 },
                  mb: { xs: 2, sm: 3 },
                  minHeight: isMobile ? '48px' : '56px',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Stack>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <MuiLink component={Link} to="/register" variant="body2">
                  Sign up here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
