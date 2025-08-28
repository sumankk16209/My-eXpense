import React from 'react';
import { Box, Typography, useTheme, useMediaQuery, Container } from '@mui/material';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import AIForecastingDashboard from '../components/AIForecastingDashboard';

const AIPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 800,
            textAlign: { xs: 'center', sm: 'left' },
            color: theme.palette.primary.main,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            gap: 2
          }}
        >
          <PsychologyIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }} />
          AI Expense Intelligence
        </Typography>
        
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            mb: 4,
            maxWidth: '800px',
            mx: { xs: 'auto', sm: 0 }
          }}
        >
          Leverage artificial intelligence to predict your expenses, gain spending insights, 
          and make smarter financial decisions with our advanced machine learning system.
        </Typography>
      </Box>

      {/* AI Forecasting Dashboard */}
      <AIForecastingDashboard />

      {/* Additional AI Features Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            fontWeight: 700,
            color: theme.palette.secondary.main,
            mb: 3,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          How AI Forecasting Works
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          mb: 4
        }}>
          {/* Feature 1 */}
          <Box sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
              📊 Data Analysis
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Our AI analyzes your spending patterns, seasonal trends, and category preferences 
              to understand your financial behavior.
            </Typography>
          </Box>

          {/* Feature 2 */}
          <Box sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.main }}>
              🧠 Machine Learning
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Advanced Random Forest algorithms learn from your data to create accurate 
              predictions and personalized insights.
            </Typography>
          </Box>

          {/* Feature 3 */}
          <Box sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.success.main }}>
              🎯 Smart Predictions
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Get monthly expense forecasts with confidence scores, helping you plan 
              budgets and make informed financial decisions.
            </Typography>
          </Box>
        </Box>

        {/* Benefits Section */}
        <Box sx={{
          p: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
          border: `1px solid ${theme.palette.primary.light}30`
        }}>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 3,
              textAlign: 'center'
            }}
          >
            Benefits of AI-Powered Forecasting
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3
          }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                💰 Better Budget Planning
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Anticipate future expenses and create more accurate monthly budgets.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.secondary.main }}>
                📈 Spending Insights
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Understand your spending patterns and identify areas for improvement.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.success.main }}>
                🎯 Goal Achievement
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Set realistic financial goals based on AI-powered predictions.
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.warning.main }}>
                ⚡ Proactive Management
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Stay ahead of your finances with early warning insights.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AIPage;
