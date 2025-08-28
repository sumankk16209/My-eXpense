import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, loginUser } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useError } from '../contexts/ErrorContext';
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

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { handleApiError, showSuccess, showWarning } = useError();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      showWarning('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      showWarning('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Register the user
      await registerUser({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.fullName,
      });

      // Auto-login after successful registration
      const formDataObj = new FormData();
      formDataObj.append('username', formData.username);
      formDataObj.append('password', formData.password);

      const loginResponse = await loginUser(formDataObj);
      login(loginResponse);
      
      showSuccess('Account created successfully! Welcome to Expense Tracker.');
      navigate('/');
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleSubmit(e),
        showDetails: true
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
            maxWidth: { xs: '100%', sm: 500 },
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
            Create Account
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
            Sign up for your expense tracker account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={isMobile ? 2 : 3}>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                autoFocus
                value={formData.fullName}
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
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
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
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
                autoComplete="new-password"
                value={formData.password}
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
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
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
                  'Create Account'
                )}
              </Button>
            </Stack>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login" variant="body2">
                  Sign in here
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterForm;
