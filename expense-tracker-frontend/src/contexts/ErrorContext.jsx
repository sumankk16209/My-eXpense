import React, { createContext, useContext, useState, useCallback } from 'react';
import ErrorPopup from '../components/ErrorPopup';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState('error');
  const [showDetails, setShowDetails] = useState(false);
  const [retryAction, setRetryAction] = useState(null);

  const showError = useCallback((errorData, options = {}) => {
    const {
      severity: errorSeverity = 'error',
      showDetails: showErrorDetails = false,
      onRetry = null,
      autoHideDuration = 6000
    } = options;

    setError(errorData);
    setSeverity(errorSeverity);
    setShowDetails(showErrorDetails);
    setRetryAction(() => onRetry);
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    showError(message, { ...options, severity: 'success' });
  }, [showError]);

  const showWarning = useCallback((message, options = {}) => {
    showError(message, { ...options, severity: 'warning' });
  }, [showError]);

  const showInfo = useCallback((message, options = {}) => {
    showError(message, { ...options, severity: 'info' });
  }, [showError]);

  const hideError = useCallback(() => {
    setError(null);
    setSeverity('error');
    setShowDetails(false);
    setRetryAction(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (retryAction) {
      retryAction();
    }
    hideError();
  }, [retryAction, hideError]);

  // Helper function to handle API errors
  const handleApiError = useCallback((error, options = {}) => {
    let errorMessage = 'An unexpected error occurred';
    let errorSeverity = 'error';
    let showErrorDetails = false;

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        errorSeverity = 'warning';
      } else if (status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
        errorSeverity = 'warning';
      } else if (status === 404) {
        errorMessage = 'The requested resource was not found.';
        errorSeverity = 'warning';
      } else if (status === 422) {
        errorMessage = data?.detail || 'Validation error. Please check your input.';
        errorSeverity = 'warning';
        showErrorDetails = true;
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
        errorSeverity = 'error';
        showErrorDetails = true;
      } else {
        errorMessage = data?.detail || data?.message || `Error ${status}: ${error.response.statusText}`;
        showErrorDetails = true;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your connection.';
      errorSeverity = 'warning';
    } else {
      // Something else happened
      errorMessage = error.message || 'An unexpected error occurred';
    }

    showError(error, {
      severity: errorSeverity,
      showDetails: showErrorDetails,
      ...options
    });
  }, [showError]);

  const value = {
    showError,
    showSuccess,
    showWarning,
    showInfo,
    hideError,
    handleApiError,
    error,
    severity,
    showDetails
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ErrorPopup
        open={!!error}
        onClose={hideError}
        error={error}
        severity={severity}
        showDetails={showDetails}
        onRetry={retryAction ? handleRetry : null}
      />
    </ErrorContext.Provider>
  );
};
