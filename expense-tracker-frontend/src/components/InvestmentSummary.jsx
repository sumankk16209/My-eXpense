import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { getInvestmentsSummary } from '../api';
import { useError } from '../contexts/ErrorContext';
import { formatINR } from '../utils/currencyUtils';
import dayjs from 'dayjs';

const InvestmentSummary = ({ onAddNew, refreshTrigger = 0 }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError } = useError();

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const summaryData = await getInvestmentsSummary();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon color="success" />;
      case 'Paused':
        return <PauseIcon color="warning" />;
      case 'Completed':
        return <CheckCircleIcon color="info" />;
      case 'Sold':
        return <CancelIcon color="secondary" />;
      case 'Matured':
        return <ScheduleIcon color="default" />;
      default:
        return <AccessTimeIcon color="action" />;
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

  if (!summary || summary.total_investments === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No investments found
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Start building your investment portfolio to see your financial summary here.
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
          Investment Portfolio Overview
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalanceIcon
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  color: theme.palette.primary.main,
                  mb: 1
                }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {formatINR(summary.total_amount)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Portfolio Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  color: theme.palette.success.main,
                  mb: 1
                }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {summary.total_investments}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Investments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircleIcon
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  color: theme.palette.info.main,
                  mb: 1
                }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {summary.active_investments}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active Investments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  color: theme.palette.warning.main,
                  mb: 1
                }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {formatINR(summary.total_sip_amount)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Monthly SIP Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Breakdown and Recent Investments */}
      <Grid container spacing={3}>
        {/* Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Investment Status Breakdown
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Active"
                  secondary={`${summary.active_investments} investments`}
                />
                <Chip
                  label={summary.active_investments}
                  color="success"
                  size="small"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <PauseIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Paused"
                  secondary={`${summary.paused_investments} investments`}
                />
                <Chip
                  label={summary.paused_investments}
                  color="warning"
                  size="small"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Completed/Sold/Matured"
                  secondary={`${summary.completed_investments} investments`}
                />
                <Chip
                  label={summary.completed_investments}
                  color="info"
                  size="small"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Recent Investments */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Recent Investments
            </Typography>
            {summary.recent_investments.length > 0 ? (
              <List dense>
                {summary.recent_investments.map((investment, index) => (
                  <React.Fragment key={investment.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: getInvestmentTypeColor(investment.type)
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={investment.name}
                        secondary={`${dayjs(investment.date).format('DD MMM, YYYY')} • ${investment.type}`}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatINR(investment.amount)}
                      </Typography>
                    </ListItem>
                    {index < summary.recent_investments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                No recent investments
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Investment Types Breakdown */}
      {Object.keys(summary.investments_by_type).length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Portfolio by Investment Type
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(summary.investments_by_type).map(([type, data]) => (
              <Grid item xs={12} sm={6} md={4} key={type}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: getInvestmentTypeColor(type),
                          mr: 1
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {type}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {formatINR(data.total_amount)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {data.count} investment{data.count !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Upcoming Maturities */}
      {summary.upcoming_maturities.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Upcoming Maturities
          </Typography>
          <Grid container spacing={2}>
            {summary.upcoming_maturities.slice(0, 6).map((maturity) => (
              <Grid item xs={12} sm={6} md={4} key={maturity.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {maturity.name}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                      {formatINR(maturity.amount)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Matures: {dayjs(maturity.maturity_date).format('DD MMM, YYYY')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {maturity.days_remaining} days remaining
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default InvestmentSummary;
