import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000'; // FastAPI backend URL

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'expense_tracker_token';
const REFRESH_TOKEN_KEY = 'expense_tracker_refresh_token';

// Get stored tokens
export const getStoredTokens = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return { token, refreshToken };
};

// Store tokens
export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Clear tokens
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Set auth header
export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Refresh token function
export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = getStoredTokens();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken
    });

    const { access_token, refresh_token } = response.data;
    storeTokens(access_token, refresh_token);
    setAuthHeader(access_token);
    return access_token;
  } catch (error) {
    clearTokens();
    setAuthHeader(null);
    throw error;
  }
};

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
    const { token } = getStoredTokens();
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to create API functions with error handling
const createApiFunction = (apiCall) => {
  return async (...args) => {
    return await apiCall(...args);
  };
};

// Authentication API functions
export const registerUser = createApiFunction(async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
});

export const loginUser = createApiFunction(async (credentials) => {
  const response = await api.post('/auth/login', credentials, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  const { access_token, refresh_token } = response.data;
  storeTokens(access_token, refresh_token);
  setAuthHeader(access_token);
  
  return response.data;
});

export const logoutUser = () => {
  clearTokens();
  setAuthHeader(null);
};

export const getCurrentUser = createApiFunction(async () => {
  const response = await api.get('/auth/me');
  return response.data;
});

export const updateUserProfile = createApiFunction(async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
});

// Category API functions
export const createCategory = createApiFunction(async (categoryData) => {
  const response = await api.post('/categories/', categoryData);
  return response.data;
});

export const getCategories = createApiFunction(async () => {
  const response = await api.get('/categories/');
  return response.data;
});

export const updateCategory = createApiFunction(async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
});

export const deleteCategory = createApiFunction(async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
});

// Expense API functions
export const createExpense = createApiFunction(async (expenseData) => {
  const response = await api.post('/expenses/', expenseData);
  return response.data;
});

export const getExpenses = createApiFunction(async () => {
  const response = await api.get('/expenses/');
  return response.data;
});

// New enhanced expense list route with filtering and sorting
export const getExpensesList = createApiFunction(async (params = {}) => {
  const response = await api.get('/expenses/list/', { params });
  return response.data;
});

// Get expenses by category
export const getExpensesByCategory = createApiFunction(async (categoryName, params = {}) => {
  const response = await api.get(`/expenses/category/${categoryName}/`, { params });
  return response.data;
});

export const getExpense = createApiFunction(async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
});

export const updateExpense = createApiFunction(async (id, expenseData) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
});

export const deleteExpense = createApiFunction(async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
});

export const getExpensesSummary = createApiFunction(async () => {
  const response = await api.get('/expenses/summary/');
  return response.data;
});

// AI Forecasting API Functions
export const trainAIModel = async () => {
  const response = await api.post('/ai/train');
  return response.data;
};

export const getExpenseForecast = async (monthsAhead = 3) => {
  const response = await api.get(`/ai/forecast?months_ahead=${monthsAhead}`);
  return response.data;
};

export const getSpendingInsights = async () => {
  const response = await api.get('/ai/insights');
  return response.data;
};

export const getAIStatus = async () => {
  const response = await api.get('/ai/status');
  return response.data;
};

// Investment API Functions
export const createInvestment = async (investmentData) => {
  const response = await api.post('/investments/', investmentData);
  return response.data;
};

export const getInvestments = async () => {
  const response = await api.get('/investments/');
  return response.data;
};

export const getInvestment = async (investmentId) => {
  const response = await api.get(`/investments/${investmentId}`);
  return response.data;
};

export const updateInvestment = async (investmentId, investmentData) => {
  const response = await api.put(`/investments/${investmentId}`, investmentData);
  return response.data;
};

export const deleteInvestment = async (investmentId) => {
  const response = await api.delete(`/investments/${investmentId}`);
  return response.data;
};

export const getInvestmentsSummary = async () => {
  const response = await api.get('/investments/summary');
  return response.data;
};

// Export the api instance for custom usage
export { api };
