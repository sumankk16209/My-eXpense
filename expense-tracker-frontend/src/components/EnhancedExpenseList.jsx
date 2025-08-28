import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { getExpenses, deleteExpense } from '../api';
import { useError } from '../contexts/ErrorContext';
import { formatINR } from '../utils/currencyUtils';
import dayjs from 'dayjs';

const EnhancedExpenseList = ({ 
  onEdit, 
  onDelete, 
  onView,
  onRefresh,
  refreshTrigger = 0
}) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError, showSuccess } = useError();

  // Fetch expenses when component mounts or refresh is triggered
  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const expensesData = await getExpenses();
      setExpenses(expensesData);
    } catch (error) {
      handleApiError(error, {
        onRetry: fetchExpenses,
        showDetails: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setDeletingId(expenseId);
    try {
      await deleteExpense(expenseId);
      showSuccess('Expense deleted successfully!');
      // Refresh the list after deletion
      fetchExpenses();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleDelete(expenseId),
        showDetails: true
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatAmount = (amount) => {
    return formatINR(amount);
  };

  const formatDate = (date) => {
    return dayjs(date).format('DD MMM, YYYY');
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Food': '#FF6B6B',
      'Food & Dining': '#FF6B6B',
      'Transportation': '#4ECDC4',
      'Housing': '#45B7D1',
      'Home & Rent': '#45B7D1',
      'Utilities': '#96CEB4',
      'Entertainment': '#FFEAA7',
      'Shopping': '#DDA0DD',
      'Health': '#98D8C8',
      'Education': '#F7DC6F',
      'Salary': '#82E0AA',
      'Other': '#BB8FCE'
    };
    return colors[categoryName] || '#BB8FCE';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No expenses found
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Start by adding your first expense using the form above.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Description
              </TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Amount
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Category
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Date
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow 
                key={expense.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.action.hover 
                  }
                }}
              >
                <TableCell 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    maxWidth: { xs: '120px', sm: '200px' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {expense.description}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 500,
                    color: expense.amount < 0 ? 'error.main' : 'success.main'
                  }}
                >
                  {formatAmount(expense.amount)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={expense.category_name || expense.category?.name}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      backgroundColor: getCategoryColor(expense.category_name || expense.category?.name),
                      color: 'white',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {formatDate(expense.date)}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {onView && (
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => onView(expense)}
                        color="primary"
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: theme.palette.primary.light + '20' 
                          }
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    )}
                    
                    {onEdit && (
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => onEdit(expense)}
                        color="primary"
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: theme.palette.primary.light + '20' 
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    
                    {onDelete && (
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => handleDelete(expense.id)}
                        color="error"
                        disabled={deletingId === expense.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: theme.palette.error.light + '20' 
                          }
                        }}
                      >
                        {deletingId === expense.id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EnhancedExpenseList;
