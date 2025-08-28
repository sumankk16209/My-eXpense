import React from 'react';
import {
  Alert,
  Snackbar,
  IconButton,
  Collapse,
  Box,
  Typography,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const ErrorPopup = ({
  open,
  onClose,
  error,
  severity = 'error',
  autoHideDuration = 6000,
  showDetails = false,
  onRetry = null
}) => {
  const [showFullDetails, setShowFullDetails] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case 'success':
        return <SuccessIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      case 'error':
      default:
        return <ErrorIcon />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'success':
        return '#2e7d32';
      case 'warning':
        return '#ed6c02';
      case 'info':
        return '#0288d1';
      case 'error':
      default:
        return '#d32f2f';
    }
  };

  const formatErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';
    
    // Handle different error formats
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    if (error.detail) {
      return error.detail;
    }
    
    if (error.error) {
      return error.error;
    }
    
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.statusText) {
      return `${error.response.status}: ${error.response.statusText}`;
    }
    
    return 'An unexpected error occurred';
  };

  const formatErrorDetails = (error) => {
    if (!error || !showDetails) return null;
    
    let details = '';
    
    if (error.response?.status) {
      details += `Status: ${error.response.status}\n`;
    }
    
    if (error.response?.statusText) {
      details += `Status Text: ${error.response.statusText}\n`;
    }
    
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'detail' && key !== 'message') {
            details += `${key}: ${JSON.stringify(value)}\n`;
          }
        });
      }
    }
    
    if (error.config?.url) {
      details += `URL: ${error.config.url}\n`;
    }
    
    if (error.config?.method) {
      details += `Method: ${error.config.method.toUpperCase()}\n`;
    }
    
    return details.trim();
  };

  const errorMessage = formatErrorMessage(error);
  const errorDetails = formatErrorDetails(error);

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        severity={severity}
        onClose={handleClose}
        icon={getSeverityIcon()}
        sx={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: getSeverityColor(),
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white'
          },
          '& .MuiAlert-message': {
            color: 'white'
          }
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {onRetry && (
              <Button
                size="small"
                onClick={onRetry}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
                variant="outlined"
              >
                Retry
              </Button>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        }
      >
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
            {errorMessage}
          </Typography>
          
          {errorDetails && (
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                onClick={() => setShowFullDetails(!showFullDetails)}
                sx={{ 
                  color: 'white', 
                  textDecoration: 'underline',
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                {showFullDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              
              <Collapse in={showFullDetails}>
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  {errorDetails}
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default ErrorPopup;
