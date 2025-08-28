import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CategorySelect from './CategorySelect';
import { createExpense, updateExpense } from '../api';
import { useError } from '../contexts/ErrorContext';
import { validateINRAmount } from '../utils/currencyUtils';

function ExpenseForm({ currentExpense, onSaveSuccess }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(dayjs());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { handleApiError, showSuccess, showWarning } = useError();

  useEffect(() => {
    if (currentExpense) {
      setDescription(currentExpense.description);
      setAmount(currentExpense.amount);
      setCategoryId(currentExpense.category.name);
      setDate(dayjs(currentExpense.date));
    } else {
      setDescription('');
      setAmount('');
      setCategoryId('');
      setDate(dayjs());
    }
  }, [currentExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim() || !amount || !categoryId) {
      return; // Basic validation
    }

    // Validate amount for Indian currency
    const amountValue = parseFloat(amount);
    const validation = validateINRAmount(amountValue);
    
    if (!validation.isValid) {
      showWarning(validation.message);
      return;
    }

    setIsSubmitting(true);
    const expenseData = {
      description: description.trim(),
      amount: amountValue,
      date: date.format('YYYY-MM-DD'),
      category_name: categoryId,
    };

    try {
      if (currentExpense) {
        await updateExpense(currentExpense.id, expenseData);
        showSuccess('Expense updated successfully!');
      } else {
        await createExpense(expenseData);
        showSuccess('Expense created successfully!');
      }
      
      onSaveSuccess(); // Notify parent to refresh list
      
      // Clear form
      setDescription('');
      setAmount('');
      setCategoryId('');
      setDate(dayjs());
    } catch (error) {
      handleApiError(error, {
        onRetry: () => handleSubmit(e),
        showDetails: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, sm: 3 },
        mx: { xs: 1, sm: 0 },
        mb: { xs: 2, sm: 3 }
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          mb: { xs: 2, sm: 3 }
        }}
      >
        {currentExpense ? 'Edit Expense' : 'Add New Expense'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack 
          spacing={isMobile ? 2 : 3}
          sx={{ width: '100%' }}
        >
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            size={isMobile ? 'medium' : 'medium'}
            sx={{
              '& .MuiInputBase-root': {
                minHeight: isMobile ? '48px' : '56px',
              }
            }}
          />
          
          <TextField
            fullWidth
            label="Amount (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            inputProps={{
              min: "0",
              step: "0.01",
              placeholder: "0.00"
            }}
            size={isMobile ? 'medium' : 'medium'}
            sx={{
              '& .MuiInputBase-root': {
                minHeight: isMobile ? '48px' : '56px',
              }
            }}
          />
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  fullWidth 
                  required
                  size={isMobile ? 'medium' : 'medium'}
                  sx={{
                    '& .MuiInputBase-root': {
                      minHeight: isMobile ? '48px' : '56px',
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>
          
          <CategorySelect 
            selectedCategory={categoryId} 
            onCategoryChange={setCategoryId} 
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || !description.trim() || !amount || !categoryId}
            size={isMobile ? 'large' : 'large'}
            sx={{
              mt: { xs: 1, sm: 2 },
              minHeight: isMobile ? '48px' : '56px',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {isSubmitting 
              ? 'Saving...' 
              : currentExpense 
                ? 'Update Expense' 
                : 'Add Expense'
            }
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

export default ExpenseForm;
