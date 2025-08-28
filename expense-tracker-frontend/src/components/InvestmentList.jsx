import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
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
  Alert,
  Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { getInvestments, deleteInvestment } from '../api';
import { useError } from '../contexts/ErrorContext';
import { formatINR } from '../utils/currencyUtils';
import dayjs from 'dayjs';

const InvestmentList = ({
  onEdit,
  onDelete,
  onView,
  onAddNew,
  refreshTrigger = 0
}) => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError, showSuccess } = useError();

  useEffect(() => {
    fetchInvestments();
  }, [refreshTrigger]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const investmentsData = await getInvestments();
      setInvestments(investmentsData);
    } catch (error) {
      handleApiError(error, {
        onRetry: fetchInvestments,
        showDetails: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (investmentId) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) {
      return;
    }

    setDeletingId(investmentId);
    try {
      await deleteInvestment(investmentId);
      showSuccess('Investment deleted successfully!');
      fetchInvestments();
      if (onDelete) {
        onDelete(investmentId);
      }
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleDelete(investmentId),
        showDetails: true
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Paused':
        return 'warning';
      case 'Completed':
        return 'info';
      case 'Sold':
        return 'secondary';
      case 'Matured':
        return 'default';
      default:
        return 'default';
    }
  };

  const getInvestmentTypeColor = (type) => {
    const colors = {
      'SIP': '#FF6B6B',
      'Stocks': '#4ECDC4',
      'LIC': '#45B7D1',
      'Mutual Funds': '#96CEB4',
      'Fixed Deposit': '#FFEAA7',
      'Gold': '#DDA0DD',
      'Real Estate': '#98D8C8',
      'PPF': '#F7DC6F',
      'NPS': '#82E0AA',
      'Bonds': '#BB8FCE',
      'Other': '#95A5A6'
    };
    return colors[type] || '#95A5A6';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!investments || investments.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No investments found
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Start building your investment portfolio by adding your first investment.
        </Typography>
        {onAddNew && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddNew}
            size={isMobile ? 'medium' : 'large'}
          >
            Add First Investment
          </Button>
        )}
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600
          }}
        >
          Investment Portfolio
        </Typography>
        {onAddNew && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddNew}
            size={isMobile ? 'medium' : 'large'}
          >
            Add Investment
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Institution</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investments.map((investment) => (
              <TableRow
                key={investment.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 500,
                    maxWidth: { xs: '120px', sm: '200px' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {investment.name}
                </TableCell>
                <TableCell>
                  <Chip
                    label={investment.investment_type}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      backgroundColor: getInvestmentTypeColor(investment.investment_type),
                      color: 'white',
                      fontWeight: 500,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main
                  }}
                >
                  {formatINR(investment.amount)}
                  {investment.is_sip && investment.sip_amount && (
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      +{formatINR(investment.sip_amount)} SIP
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={investment.status}
                    size={isMobile ? 'small' : 'medium'}
                    color={getStatusColor(investment.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  {dayjs(investment.date).format('DD MMM, YYYY')}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: { xs: '100px', sm: '150px' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {investment.institution || '-'}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    {onView && (
                      <IconButton
                        size={isMobile ? 'small' : 'medium'}
                        onClick={() => onView(investment)}
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
                        onClick={() => onEdit(investment)}
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
                        onClick={() => handleDelete(investment.id)}
                        color="error"
                        disabled={deletingId === investment.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.error.light + '20'
                          }
                        }}
                      >
                        {deletingId === investment.id ? (
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
    </Box>
  );
};

export default InvestmentList;
