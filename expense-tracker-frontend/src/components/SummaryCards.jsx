import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { formatSummaryAmount } from '../utils/currencyUtils';

const SummaryCards = ({ summary, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCardIcon = (type) => {
    const iconProps = {
      sx: {
        fontSize: { xs: '2rem', sm: '2.5rem' },
        color: 'white'
      }
    };

    switch (type) {
      case 'total':
        return <AccountBalanceIcon {...iconProps} />;
      case 'count':
        return <TrendingUpIcon {...iconProps} />;
      case 'first':
        return <CalendarIcon {...iconProps} />;
      case 'latest':
        return <CalendarIcon {...iconProps} />;
      default:
        return <TrendingUpIcon {...iconProps} />;
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'total':
        return theme.palette.primary.main;
      case 'count':
        return theme.palette.success.main;
      case 'first':
        return theme.palette.info.main;
      case 'latest':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const renderCard = (title, value, type, subtitle = '') => {
    if (loading) {
      return (
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            minHeight: { xs: '120px', sm: '140px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 8,
            }
          }}
        >
          <Box>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
          </Box>
          <Skeleton variant="text" width="80%" height={32} />
        </Paper>
      );
    }

    return (
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          minHeight: { xs: '120px', sm: '140px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 8,
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mb: 0.5,
                textTransform: 'uppercase',
                fontWeight: 500,
                letterSpacing: 0.5
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  fontSize: { xs: '0.625rem', sm: '0.75rem' },
                  opacity: 0.7
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: getCardColor(type),
              borderRadius: '50%',
              p: { xs: 1, sm: 1.5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2
            }}
          >
            {getCardIcon(type)}
          </Box>
        </Box>
        
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.2
          }}
        >
          {value}
        </Typography>
      </Paper>
    );
  };

  const cards = [
    {
      title: 'Total Expenses',
      value: formatSummaryAmount(summary?.total_amount || 0),
      type: 'total',
      subtitle: 'All time'
    },
    {
      title: 'Total Count',
      value: summary?.total_expenses || 0,
      type: 'count',
      subtitle: 'Transactions'
    },
    {
      title: 'First Expense',
      value: formatDate(summary?.first_expense_date),
      type: 'first',
      subtitle: 'Started tracking'
    },
    {
      title: 'Latest Expense',
      value: formatDate(summary?.latest_expense_date),
      type: 'latest',
      subtitle: 'Most recent'
    }
  ];

  return (
    <Grid
      container
      spacing={isMobile ? 2 : 3}
      sx={{ mb: { xs: 3, sm: 4, md: 5 } }}
    >
      {cards.map((card, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={index}
        >
          {renderCard(card.title, card.value, card.type, card.subtitle)}
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
