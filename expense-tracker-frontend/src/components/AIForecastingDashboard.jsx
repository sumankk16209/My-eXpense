import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Stack,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  PlayArrow as TrainIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { trainAIModel, getExpenseForecast, getSpendingInsights, getAIStatus } from '../api';
import { useError } from '../contexts/ErrorContext';
import { formatINR } from '../utils/currencyUtils';

const AIForecastingDashboard = () => {
  const [aiStatus, setAiStatus] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError, showSuccess } = useError();

  useEffect(() => {
    fetchAIStatus();
  }, []);

  useEffect(() => {
    if (aiStatus?.model_trained) {
      fetchForecast();
      fetchInsights();
    }
  }, [aiStatus, refreshTrigger]);

  const fetchAIStatus = async () => {
    try {
      const status = await getAIStatus();
      setAiStatus(status);
    } catch (error) {
      handleApiError(error, {
        onRetry: fetchAIStatus,
        showDetails: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      const forecastData = await getExpenseForecast(6); // 6 months ahead
      setForecast(forecastData);
    } catch (error) {
      handleApiError(error, {
        onRetry: fetchForecast,
        showDetails: false
      });
    }
  };

  const fetchInsights = async () => {
    try {
      const insightsData = await getSpendingInsights();
      setInsights(insightsData);
    } catch (error) {
      handleApiError(error, {
        onRetry: fetchInsights,
        showDetails: false
      });
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      const result = await trainAIModel();
      showSuccess('AI model trained successfully!');
      setRefreshTrigger(prev => prev + 1);
      await fetchAIStatus();
    } catch (error) {
      handleApiError(error, {
        onRetry: handleTrainModel,
        showDetails: true
      });
    } finally {
      setIsTraining(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getInsightSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend':
        return <TrendingUpIcon />;
      case 'category':
        return <PsychologyIcon />;
      case 'budget':
        return <LightbulbIcon />;
      default:
        return <LightbulbIcon />;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
          fontWeight: 700,
          color: theme.palette.primary.main,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <PsychologyIcon />
        AI Expense Forecasting
      </Typography>

      {/* AI Status and Training Section */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI Model Status
          </Typography>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
            size={isMobile ? 'small' : 'medium'}
          >
            Refresh
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={aiStatus?.model_trained ? 'Trained' : 'Not Trained'}
                color={aiStatus?.model_trained ? 'success' : 'default'}
                size={isMobile ? 'small' : 'medium'}
              />
              {aiStatus?.model_saved && (
                <Chip
                  label="Saved"
                  color="info"
                  size={isMobile ? 'small' : 'medium'}
                />
              )}
            </Box>
            <Typography variant="body2" color="textSecondary">
              {aiStatus?.model_trained 
                ? 'Your AI model is ready to make predictions'
                : 'Train the AI model to start forecasting expenses'
              }
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTrainModel}
              disabled={isTraining}
              startIcon={isTraining ? <CircularProgress size={20} /> : <TrainIcon />}
              fullWidth={isMobile}
              sx={{ minHeight: { xs: '40px', sm: '50px' } }}
            >
              {isTraining ? 'Training...' : 'Train AI Model'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Forecast Section */}
      {forecast && (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Expense Forecast (Next 6 Months)
          </Typography>
          
          <Grid container spacing={2}>
            {forecast.predictions?.map((prediction, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}10)`
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {prediction.month_name}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
                      {formatINR(prediction.predicted_amount)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Confidence:
                      </Typography>
                      <Chip
                        label={`${(prediction.confidence * 100).toFixed(0)}%`}
                        size="small"
                        color={prediction.confidence > 0.8 ? 'success' : prediction.confidence > 0.6 ? 'warning' : 'default'}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={prediction.confidence * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Insights Section */}
      {insights && (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Smart Insights & Recommendations
          </Typography>
          
          <Stack spacing={2}>
            {insights.insights?.map((insight, index) => (
              <Alert
                key={index}
                severity={insight.severity}
                icon={getInsightIcon(insight.type)}
                sx={{
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2">
                    {insight.message}
                  </Typography>
                </Box>
              </Alert>
            ))}
          </Stack>
        </Paper>
      )}

      {/* No Data Message */}
      {!aiStatus?.model_trained && !isTraining && (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <PsychologyIcon sx={{ fontSize: 60, color: theme.palette.grey[400], mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            AI Model Not Trained
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Train the AI model with your expense data to get personalized forecasts and insights.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTrainModel}
            startIcon={<TrainIcon />}
            size={isMobile ? 'medium' : 'large'}
          >
            Start Training
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default AIForecastingDashboard;
