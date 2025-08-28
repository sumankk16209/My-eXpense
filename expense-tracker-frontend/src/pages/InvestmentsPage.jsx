import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  List as ListIcon,
  Add as AddIcon
} from '@mui/icons-material';
import InvestmentForm from '../components/InvestmentForm';
import InvestmentSummary from '../components/InvestmentSummary';
import InvestmentList from '../components/InvestmentList';

function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAddNew = () => {
    setEditingInvestment(null);
    setShowForm(true);
  };

  const handleEditInvestment = (investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleDeleteInvestment = (investmentId) => {
    // Refresh the data after deletion
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewInvestment = (investment) => {
    // Could open a detail modal or navigate to a detail page
    console.log('View investment:', investment);
  };

  const handleSaveSuccess = () => {
    setShowForm(false);
    setEditingInvestment(null);
    // Refresh the data after saving
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingInvestment(null);
  };

  // If form is open, show only the form
  if (showForm) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {editingInvestment 
              ? 'Update your investment details below.' 
              : 'Add a new investment to your portfolio. Track SIP, Stocks, LIC, Mutual Funds, and more.'
            }
          </Typography>
        </Paper>
        
        <InvestmentForm
          currentInvestment={editingInvestment}
          onSaveSuccess={handleSaveSuccess}
          onCancel={handleCancelForm}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Investment Portfolio
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your investments including SIP, Stocks, LIC, Mutual Funds, Fixed Deposits, and more. 
          Track your portfolio performance and stay on top of your financial goals.
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
          <Tab 
            label="Portfolio Overview" 
            icon={<AccountBalanceIcon />}
            iconPosition="start"
          />
          <Tab 
            label="All Investments" 
            icon={<ListIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
      
      {/* Tab content */}
      {activeTab === 0 && (
        <InvestmentSummary
          onAddNew={handleAddNew}
          refreshTrigger={refreshTrigger}
        />
      )}
      
      {activeTab === 1 && (
        <InvestmentList
          onEdit={handleEditInvestment}
          onDelete={handleDeleteInvestment}
          onView={handleViewInvestment}
          onAddNew={handleAddNew}
          refreshTrigger={refreshTrigger}
        />
      )}
    </Container>
  );
}

export default InvestmentsPage;
