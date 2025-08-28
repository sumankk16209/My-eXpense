import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createInvestment, updateInvestment } from '../api';
import { useError } from '../contexts/ErrorContext';
import { formatINR } from '../utils/currencyUtils';

const InvestmentForm = ({ currentInvestment, onSaveSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    investment_type: '',
    amount: '',
    date: dayjs(),
    status: 'Active',
    description: '',
    institution: '',
    account_number: '',
    folio_number: '',
    units: '',
    nav: '',
    maturity_date: null,
    interest_rate: '',
    frequency: '',
    is_sip: false,
    sip_amount: '',
    sip_frequency: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError, showSuccess } = useError();

  useEffect(() => {
    if (currentInvestment) {
      setFormData({
        name: currentInvestment.name || '',
        investment_type: currentInvestment.investment_type || '',
        amount: currentInvestment.amount || '',
        date: currentInvestment.date ? dayjs(currentInvestment.date) : dayjs(),
        status: currentInvestment.status || 'Active',
        description: currentInvestment.description || '',
        institution: currentInvestment.institution || '',
        account_number: currentInvestment.account_number || '',
        folio_number: currentInvestment.folio_number || '',
        units: currentInvestment.units || '',
        nav: currentInvestment.nav || '',
        maturity_date: currentInvestment.maturity_date ? dayjs(currentInvestment.maturity_date) : null,
        interest_rate: currentInvestment.interest_rate || '',
        frequency: currentInvestment.frequency || '',
        is_sip: currentInvestment.is_sip || false,
        sip_amount: currentInvestment.sip_amount || '',
        sip_frequency: currentInvestment.sip_frequency || ''
      });
    }
  }, [currentInvestment]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Investment name is required';
    }

    if (!formData.investment_type) {
      newErrors.investment_type = 'Investment type is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.is_sip && (!formData.sip_amount || formData.sip_amount <= 0)) {
      newErrors.sip_amount = 'SIP amount is required when SIP is enabled';
    }

    if (formData.is_sip && !formData.sip_frequency) {
      newErrors.sip_frequency = 'SIP frequency is required when SIP is enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const investmentData = {
        ...formData,
        date: formData.date.format('YYYY-MM-DD'),
        maturity_date: formData.maturity_date ? formData.maturity_date.format('YYYY-MM-DD') : null,
        amount: parseFloat(formData.amount),
        units: formData.units ? parseFloat(formData.units) : null,
        nav: formData.nav ? parseFloat(formData.nav) : null,
        interest_rate: formData.interest_rate ? parseFloat(formData.interest_rate) : null,
        sip_amount: formData.sip_amount ? parseFloat(formData.sip_amount) : null
      };

      if (currentInvestment) {
        await updateInvestment(currentInvestment.id, investmentData);
        showSuccess('Investment updated successfully!');
      } else {
        await createInvestment(investmentData);
        showSuccess('Investment created successfully!');
      }

      onSaveSuccess();
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleSubmit(e),
        showDetails: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInvestmentTypeFields = () => {
    switch (formData.investment_type) {
      case 'SIP':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SIP Amount (₹)"
                type="number"
                value={formData.sip_amount}
                onChange={(e) => handleChange('sip_amount', e.target.value)}
                error={!!errors.sip_amount}
                helperText={errors.sip_amount}
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>SIP Frequency</InputLabel>
                <Select
                  value={formData.sip_frequency}
                  onChange={(e) => handleChange('sip_frequency', e.target.value)}
                  error={!!errors.sip_frequency}
                  label="SIP Frequency"
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Semi-annually">Semi-annually</MenuItem>
                  <MenuItem value="Annually">Annually</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 'Mutual Funds':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Folio Number"
                value={formData.folio_number}
                onChange={(e) => handleChange('folio_number', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Units"
                type="number"
                value={formData.units}
                onChange={(e) => handleChange('units', e.target.value)}
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NAV (₹)"
                type="number"
                value={formData.nav}
                onChange={(e) => handleChange('nav', e.target.value)}
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>
          </Grid>
        );

      case 'Stocks':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Units/Shares"
                type="number"
                value={formData.units}
                onChange={(e) => handleChange('units', e.target.value)}
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per Share (₹)"
                type="number"
                value={formData.nav}
                onChange={(e) => handleChange('nav', e.target.value)}
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>
          </Grid>
        );

      case 'Fixed Deposit':
      case 'LIC':
      case 'Bonds':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Maturity Date"
                  value={formData.maturity_date}
                  onChange={(newDate) => handleChange('maturity_date', newDate)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interest Rate (%)"
                type="number"
                value={formData.interest_rate}
                onChange={(e) => handleChange('interest_rate', e.target.value)}
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mx: { xs: 1, sm: 0 }, mb: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' }, mb: { xs: 2, sm: 3 } }}>
        {currentInvestment ? 'Edit Investment' : 'Add New Investment'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Investment Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.investment_type}>
              <InputLabel>Investment Type</InputLabel>
              <Select
                value={formData.investment_type}
                onChange={(e) => handleChange('investment_type', e.target.value)}
                label="Investment Type"
              >
                <MenuItem value="SIP">SIP</MenuItem>
                <MenuItem value="Stocks">Stocks</MenuItem>
                <MenuItem value="LIC">LIC</MenuItem>
                <MenuItem value="Mutual Funds">Mutual Funds</MenuItem>
                <MenuItem value="Fixed Deposit">Fixed Deposit</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
                <MenuItem value="Real Estate">Real Estate</MenuItem>
                <MenuItem value="PPF">PPF</MenuItem>
                <MenuItem value="NPS">NPS</MenuItem>
                <MenuItem value="Bonds">Bonds</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount (₹)"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              error={!!errors.amount}
              helperText={errors.amount}
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Investment Date"
                value={formData.date}
                onChange={(newDate) => handleChange('date', newDate)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required error={!!errors.date} helperText={errors.date} />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Paused">Paused</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Sold">Sold</MenuItem>
                <MenuItem value="Matured">Matured</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_sip}
                  onChange={(e) => handleChange('is_sip', e.target.checked)}
                />
              }
              label="Is SIP Investment"
            />
          </Grid>

          {/* SIP Specific Fields */}
          {formData.is_sip && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
                SIP Details
              </Typography>
              {getInvestmentTypeFields()}
            </Grid>
          )}

          {/* Investment Type Specific Fields */}
          {formData.investment_type && !formData.is_sip && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main }}>
                {formData.investment_type} Details
              </Typography>
              {getInvestmentTypeFields()}
            </Grid>
          )}

          {/* Additional Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
              Additional Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Institution/Bank"
              value={formData.institution}
              onChange={(e) => handleChange('institution', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Number"
              value={formData.account_number}
              onChange={(e) => handleChange('account_number', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={3}
            />
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {onCancel && (
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  size={isMobile ? 'medium' : 'large'}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                size={isMobile ? 'medium' : 'large'}
                sx={{ minWidth: '120px' }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : currentInvestment ? (
                  'Update Investment'
                ) : (
                  'Add Investment'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default InvestmentForm;
