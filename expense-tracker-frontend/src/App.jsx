import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ExpensesListPage from './pages/ExpensesListPage';
import ProfilePage from './pages/ProfilePage';
import AIPage from './pages/AIPage';
import InvestmentsPage from './pages/InvestmentsPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1, pt: { xs: 7, sm: 8 } }}>
              <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />

                  {/* Protected Routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/expenses" element={
                    <ProtectedRoute>
                      <ExpensesListPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/investments" element={
                    <ProtectedRoute>
                      <InvestmentsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/ai" element={
                    <ProtectedRoute>
                      <AIPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />

                  {/* 404 Page - Catch all unmatched routes */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Container>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
