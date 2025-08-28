import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Button, Paper, Stack } from '@mui/material';
import { Psychology as PsychologyIcon, ArrowForward as ArrowForwardIcon, CalendarMonth as CalendarIcon, AccountBalance as AccountBalanceIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import EnhancedExpenseList from '../components/EnhancedExpenseList';
import SummaryCards from '../components/SummaryCards';
import { getExpensesSummary } from '../api';
import { useError } from '../contexts/ErrorContext';

const HomePage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError, showSuccess } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const summaryData = await getExpensesSummary();
      setSummary(summaryData);
    } catch (error) {
      handleApiError(error, {
        onRetry: fetchSummary,
        showDetails: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSuccess = () => {
    setEditingExpense(null);
    // Trigger refresh of expense list and summary
    setRefreshTrigger(prev => prev + 1);
    fetchSummary();
    showSuccess('Expense saved successfully!');
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (expenseId) => {
    // This will be handled by the EnhancedExpenseList component
    // We just need to refresh the summary
    await fetchSummary();
  };

  const handleView = (expense) => {
    // For now, just show the expense details in console
    console.log('Viewing expense:', expense);
    // You can implement a modal or navigate to a detail page
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
          fontWeight: 700,
          textAlign: { xs: 'center', sm: 'left' },
          mb: { xs: 2, sm: 3, md: 4 },
          color: theme.palette.primary.main
        }}
      >
        Expense Tracker
      </Typography>

      {/* Summary Cards */}
      <SummaryCards summary={summary} loading={loading} />

      {/* Expense Form */}
      <ExpenseForm 
        currentExpense={editingExpense}
        onSaveSuccess={handleSaveSuccess}
        onCancel={handleCancelEdit}
      />

      {/* Expense List */}
      <Box sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600,
            mb: { xs: 2, sm: 3 },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Recent Expenses
        </Typography>
        
        <EnhancedExpenseList
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onRefresh={fetchSummary}
          refreshTrigger={refreshTrigger}
        />
      </Box>

      {/* AI Quick Access Section */}
      <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
        <Stack spacing={3}> {/* Wrapped in Stack for spacing */}
          {/* AI Forecasting Section */}
          <Paper
            elevation={3}
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.secondary.light}10)`,
              border: `1px solid ${theme.palette.primary.light}30`,
              borderRadius: 3
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: { xs: '80px', sm: '100px' },
                height: { xs: '80px', sm: '100px' },
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              }}>
                <PsychologyIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />
              </Box>
              
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  Ready for AI-Powered Insights?
                </Typography>
                
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  Get personalized expense forecasts, spending insights, and smart recommendations 
                  using our advanced machine learning system. Train the AI with your data and 
                  unlock the power of predictive finance.
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? 'large' : 'large'}
                  onClick={() => navigate('/ai')}
                  startIcon={<PsychologyIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Explore AI Forecasting
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Monthly Overview Section */}
          <Paper
            elevation={3}
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              background: `linear-gradient(135deg, ${theme.palette.primary.light}10, ${theme.palette.secondary.light}10)`,
              border: `1px solid ${theme.palette.primary.light}30`,
              borderRadius: 3
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 3
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: { xs: '80px', sm: '100px' },
                height: { xs: '80px', sm: '100px' },
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                color: 'white'
              }}>
                <CalendarIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />
              </Box>
              
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  Monthly Expenses Overview
                </Typography>
                
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  View your expenses organized by month with spending trends, category analysis,
                  and month-over-month comparisons. Perfect for understanding your spending patterns
                  and preparing data for AI forecasting.
                </Typography>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  size={isMobile ? 'large' : 'large'}
                  onClick={() => navigate('/ai?tab=1')} // Navigate to AI page, tab 1
                  startIcon={<CalendarIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  View Monthly Analysis
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Investments Section */}
          <Paper
            elevation={3}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: { xs: 2, sm: 3 }
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: '60px', sm: '80px' },
                height: { xs: '60px', sm: '80px' },
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                backdropFilter: 'blur(10px)'
              }}>
                <AccountBalanceIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />
              </Box>
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  💰 Investment Portfolio
                </Typography>
                <Typography variant="body1" sx={{
                  opacity: 0.9,
                  mb: 2,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Track your SIP, Stocks, LIC, Mutual Funds, Fixed Deposits, and other investments.
                  Monitor portfolio performance, upcoming maturities, and build wealth systematically.
                </Typography>
                <Button
                  variant="contained"
                  color="inherit"
                  size={isMobile ? 'large' : 'large'}
                  onClick={() => navigate('/investments')}
                  startIcon={<AccountBalanceIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#667eea',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Manage Investments
                </Button>
              </Box>
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default HomePage;
