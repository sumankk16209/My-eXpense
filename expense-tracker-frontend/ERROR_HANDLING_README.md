# 🚨 Frontend Error Handling System

## Overview
This document describes the comprehensive error handling system implemented in the Expense Tracker frontend. The system provides user-friendly error notifications, automatic error categorization, and retry functionality.

## 🏗️ Architecture

### 1. **ErrorPopup Component** (`src/components/ErrorPopup.jsx`)
A reusable popup component that displays errors with different severity levels and actions.

**Features:**
- Multiple severity levels (error, warning, info, success)
- Expandable error details
- Retry functionality
- Auto-hide with configurable duration
- Responsive design for mobile and desktop

**Props:**
```jsx
<ErrorPopup
  open={boolean}
  onClose={function}
  error={errorObject}
  severity="error|warning|info|success"
  autoHideDuration={6000}
  showDetails={false}
  onRetry={function}
/>
```

### 2. **ErrorContext** (`src/contexts/ErrorContext.jsx`)
Global error management context that provides error handling functions throughout the application.

**Available Functions:**
- `showError(error, options)` - Display any type of error
- `showSuccess(message, options)` - Show success notifications
- `showWarning(message, options)` - Show warning notifications
- `showInfo(message, options)` - Show info notifications
- `handleApiError(error, options)` - Handle API errors automatically
- `hideError()` - Hide current error
- `error` - Current error state
- `severity` - Current error severity
- `showDetails` - Whether to show detailed error information

## 🎯 Usage Examples

### Basic Error Display
```jsx
import { useError } from '../contexts/ErrorContext';

const MyComponent = () => {
  const { showError, showSuccess } = useError();
  
  const handleAction = async () => {
    try {
      await someApiCall();
      showSuccess('Action completed successfully!');
    } catch (error) {
      showError('Something went wrong!');
    }
  };
};
```

### API Error Handling
```jsx
import { useError } from '../contexts/ErrorContext';

const MyComponent = () => {
  const { handleApiError } = useError();
  
  const handleApiCall = async () => {
    try {
      await apiFunction();
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleApiCall(),
        showDetails: true
      });
    }
  };
};
```

### With Retry Functionality
```jsx
const { handleApiError } = useError();

try {
  await createExpense(expenseData);
} catch (error) {
  handleApiError(error, {
    onRetry: () => createExpense(expenseData),
    showDetails: true
  });
}
```

## 🔧 Error Types & Handling

### 1. **HTTP Status Codes**
- **401 Unauthorized**: Authentication failed, redirects to login
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **422 Validation Error**: Input validation failed (shows details)
- **5xx Server Errors**: Server-side issues (shows details)

### 2. **Network Errors**
- Connection issues
- Timeout errors
- CORS problems

### 3. **Validation Errors**
- Form validation failures
- API validation errors
- Business logic errors

## 🎨 UI Components

### ErrorPopup Styling
- **Error**: Red background with error icon
- **Warning**: Orange background with warning icon
- **Info**: Blue background with info icon
- **Success**: Green background with success icon

### Responsive Design
- Mobile-optimized popup positioning
- Touch-friendly close buttons
- Adaptive sizing for different screen sizes

## 📱 Mobile Compatibility

### Features
- Touch-friendly error popups
- Swipe-to-dismiss functionality
- Mobile-optimized button sizes
- Responsive error message layout

### Breakpoints
- **xs**: Mobile phones (< 600px)
- **sm**: Tablets (600px - 960px)
- **md**: Desktop (960px - 1280px)
- **lg**: Large desktop (> 1280px)

## 🔄 Retry Mechanism

### Automatic Retry
- Token refresh on 401 errors
- Network error retry prompts
- User-initiated retry actions

### Retry Options
```jsx
handleApiError(error, {
  onRetry: () => retryFunction(),
  showDetails: true,
  severity: 'warning'
});
```

## 🚀 Integration Points

### 1. **API Layer** (`src/api.js`)
- All API functions wrapped with error handling
- Automatic token refresh
- Consistent error propagation

### 2. **Components**
- **ExpenseForm**: Form submission errors
- **LoginForm**: Authentication errors
- **RegisterForm**: Registration errors
- **EnhancedExpenseList**: CRUD operation errors
- **HomePage**: Data fetching errors

### 3. **Context Providers**
- **ErrorProvider**: Wraps entire application
- **AuthProvider**: Authentication error handling
- **Router**: Navigation error handling

## 🧪 Testing Error Scenarios

### 1. **Network Errors**
- Disconnect internet
- Slow network conditions
- Server unavailability

### 2. **Authentication Errors**
- Expired tokens
- Invalid credentials
- Permission issues

### 3. **Validation Errors**
- Invalid form data
- Missing required fields
- Business rule violations

### 4. **Server Errors**
- 500 Internal Server Error
- Database connection issues
- Service unavailability

## 📋 Error Logging

### Console Logging
- Detailed error information in development
- Stack traces for debugging
- API response details

### User Feedback
- Clear error messages
- Actionable error descriptions
- Helpful retry suggestions

## 🎯 Best Practices

### 1. **Error Message Guidelines**
- Use clear, actionable language
- Avoid technical jargon
- Provide helpful suggestions
- Include retry options when appropriate

### 2. **Error Handling Patterns**
- Always wrap async operations in try-catch
- Use `handleApiError` for API calls
- Provide retry functionality for recoverable errors
- Show appropriate severity levels

### 3. **User Experience**
- Don't block the UI unnecessarily
- Provide immediate feedback
- Allow users to continue working
- Clear error states after resolution

## 🔧 Configuration

### ErrorPopup Settings
```jsx
// Default configuration
const defaultConfig = {
  autoHideDuration: 6000,    // 6 seconds
  showDetails: false,         // Hide details by default
  severity: 'error',          // Default severity
  position: 'top-center'      // Popup position
};
```

### Context Configuration
```jsx
// ErrorProvider options
<ErrorProvider>
  {/* App content */}
</ErrorProvider>
```

## 🚨 Troubleshooting

### Common Issues
1. **Errors not showing**: Check ErrorProvider wrapping
2. **Retry not working**: Verify onRetry function
3. **Popup positioning**: Check z-index and positioning
4. **Mobile issues**: Verify responsive breakpoints

### Debug Mode
```jsx
// Enable detailed error logging
const { handleApiError } = useError();

handleApiError(error, {
  showDetails: true,
  onRetry: () => console.log('Retry clicked')
});
```

## 📚 Related Files

- `src/components/ErrorPopup.jsx` - Error popup component
- `src/contexts/ErrorContext.jsx` - Error management context
- `src/App.jsx` - ErrorProvider integration
- `src/api.js` - API error handling
- `src/components/*.jsx` - Component error handling

---

**The error handling system provides a robust, user-friendly way to manage errors throughout the application while maintaining a consistent user experience across all devices.** 🎉
