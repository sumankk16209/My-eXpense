import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import EnhancedExpenseList from '../components/EnhancedExpenseList';
import ExpenseCharts from '../components/ExpenseCharts';
import MonthlyExpensesList from '../components/MonthlyExpensesList';
import { useNavigate } from 'react-router-dom';

function ExpensesListPage() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleEditExpense = (expense) => {
    // Navigate to home page with edit mode
    navigate('/', { state: { editExpense: expense } });
  };

  const handleDeleteExpense = async (expenseId) => {
    // This will be handled by the EnhancedExpenseList component
    console.log('Delete expense:', expenseId);
  };

  const handleViewExpense = (expense) => {
    // Could open a detail modal or navigate to a detail page
    console.log('View expense:', expense);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Expenses Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          View, filter, and analyze your expenses with advanced tools and visualizations.
        </Typography>
      </Paper>
      
      {/* Tabs for different views */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{ 
            mb: 2,
            '& .MuiTab-root': {
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              textTransform: 'none',
              minHeight: { xs: '48px', sm: '56px' }
            }
          }}
        >
          <Tab label="Expenses List" />
          <Tab label="Category Charts" />
          <Tab label="Monthly Overview" />
        </Tabs>
      </Box>
      
      {/* Tab content */}
      {activeTab === 0 && (
        <EnhancedExpenseList 
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          onView={handleViewExpense}
        />
      )}
      
      {activeTab === 1 && (
        <ExpenseCharts />
      )}

      {activeTab === 2 && (
        <Box>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 3,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            📊 Monthly Expenses Analysis
          </Typography>
          
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 4, textAlign: { xs: 'center', sm: 'left' } }}
          >
            View your expenses organized by month with spending trends, category analysis, 
            and month-over-month comparisons. Perfect for understanding your spending patterns 
            and identifying seasonal trends.
          </Typography>

          <MonthlyExpensesList
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onView={handleViewExpense}
          />
        </Box>
      )}
    </Container>
  );
}

export default ExpensesListPage;
