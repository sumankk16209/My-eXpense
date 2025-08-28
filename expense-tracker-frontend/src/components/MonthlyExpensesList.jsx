import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { getExpenses } from '../api';
import { useError } from '../contexts/ErrorContext';
import { formatINR } from '../utils/currencyUtils';
import dayjs from 'dayjs';

const MonthlyExpensesList = ({
  onEdit,
  onDelete,
  onView,
  refreshTrigger = 0
}) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError, showSuccess } = useError();

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
      await onDelete(expenseId);
      showSuccess('Expense deleted successfully!');
      fetchExpenses();
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleDelete(expenseId),
        showDetails: true
      });
    } finally {
      setDeletingId(null);
    }
  };

  const groupExpensesByMonth = (expenses) => {
    const grouped = {};
    
    expenses.forEach(expense => {
      const monthKey = dayjs(expense.date).format('YYYY-MM');
      const monthName = dayjs(expense.date).format('MMMM YYYY');
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          monthKey,
          monthName,
          expenses: [],
          totalAmount: 0,
          expenseCount: 0,
          categories: new Set()
        };
      }
      
      grouped[monthKey].expenses.push(expense);
      grouped[monthKey].totalAmount += expense.amount;
      grouped[monthKey].expenseCount += 1;
      grouped[monthKey].categories.add(expense.category_name || expense.category?.name);
    });

    // Sort months in descending order (most recent first)
    return Object.values(grouped).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
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

  const getMonthTrend = (monthData, allMonths) => {
    const currentIndex = allMonths.findIndex(m => m.monthKey === monthData.monthKey);
    if (currentIndex === allMonths.length - 1 || currentIndex === -1) return 'neutral';
    
    const previousMonth = allMonths[currentIndex + 1];
    if (!previousMonth) return 'neutral';
    
    const change = monthData.totalAmount - previousMonth.totalAmount;
    const changePercent = (change / previousMonth.totalAmount) * 100;
    
    if (changePercent > 10) return 'increase';
    if (changePercent < -10) return 'decrease';
    return 'neutral';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increase':
        return <TrendingUpIcon color="error" />;
      case 'decrease':
        return <TrendingDownIcon color="success" />;
      default:
        return null;
    }
  };

  const getTrendText = (trend, monthData, allMonths) => {
    if (trend === 'neutral') return '';
    
    const currentIndex = allMonths.findIndex(m => m.monthKey === monthData.monthKey);
    const previousMonth = allMonths[currentIndex + 1];
    if (!previousMonth) return '';
    
    const change = monthData.totalAmount - previousMonth.totalAmount;
    const changePercent = (change / previousMonth.totalAmount) * 100;
    
    if (trend === 'increase') {
      return `+${changePercent.toFixed(1)}% from previous month`;
    } else {
      return `${changePercent.toFixed(1)}% from previous month`;
    }
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

  const monthlyGroups = groupExpensesByMonth(expenses);

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 600,
          mb: 3,
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Monthly Expenses Overview
      </Typography>

      <Stack spacing={2}>
        {monthlyGroups.map((monthData) => {
          const trend = getMonthTrend(monthData, monthlyGroups);
          const trendText = getTrendText(trend, monthData, monthlyGroups);
          
          return (
            <Accordion
              key={monthData.monthKey}
              expanded={expandedMonth === monthData.monthKey}
              onChange={() => setExpandedMonth(
                expandedMonth === monthData.monthKey ? null : monthData.monthKey
              )}
              sx={{
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%',
                  pr: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {monthData.monthName}
                    </Typography>
                    {getTrendIcon(trend)}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {formatINR(monthData.totalAmount)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {monthData.expenseCount} expenses
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails sx={{ p: 0 }}>
                {/* Month Summary */}
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: theme.palette.grey[50],
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                    gap: 2
                  }}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Total Spent
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {formatINR(monthData.totalAmount)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Transaction Count
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {monthData.expenseCount}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Categories Used
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {monthData.categories.size}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {trendText && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTrendIcon(trend)}
                      <Typography variant="body2" color="textSecondary">
                        {trendText}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Expenses Table */}
                <TableContainer>
                  <Table size={isMobile ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {monthData.expenses.map((expense) => (
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
                              fontWeight: 500,
                              color: expense.amount < 0 ? 'error.main' : 'success.main'
                            }}
                          >
                            {formatINR(expense.amount)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={expense.category_name || expense.category?.name}
                              size={isMobile ? 'small' : 'medium'}
                              sx={{
                                backgroundColor: getCategoryColor(expense.category_name || expense.category?.name),
                                color: 'white',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {dayjs(expense.date).format('DD MMM, YYYY')}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                              {onView && (
                                <IconButton
                                  size={isMobile ? 'small' : 'medium'}
                                  onClick={() => onView(expense)}
                                  color="primary"
                                >
                                  <ViewIcon />
                                </IconButton>
                              )}

                              {onEdit && (
                                <IconButton
                                  size={isMobile ? 'small' : 'medium'}
                                  onClick={() => onEdit(expense)}
                                  color="primary"
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
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
};

export default MonthlyExpensesList;
