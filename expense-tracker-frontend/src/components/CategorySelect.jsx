import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, useTheme, useMediaQuery } from '@mui/material';

const ExpenseCategory = {
  FOOD_DINING: "Food & Dining",
  TRANSPORTATION: "Transportation",
  HOME_RENT: "Home & Rent",
  UTILITIES: "Utilities",
  ENTERTAINMENT: "Entertainment",
  SHOPPING: "Shopping",
  HEALTH: "Health",
  EDUCATION: "Education",
  SALARY: "Salary",
  OTHER: "Other",
};

function CategorySelect({ selectedCategory, onCategoryChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <FormControl 
      fullWidth 
      required
      size={isMobile ? 'medium' : 'medium'}
      sx={{
        '& .MuiInputBase-root': {
          minHeight: isMobile ? '48px' : '56px',
        }
      }}
    >
      <InputLabel id="category-select-label">Category</InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={selectedCategory}
        label="Category"
        onChange={(e) => onCategoryChange(e.target.value)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: isMobile ? 300 : 400,
            },
          },
        }}
      >
        {Object.entries(ExpenseCategory).map(([key, value]) => (
          <MenuItem 
            key={key} 
            value={value}
            sx={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              py: isMobile ? 1 : 1.5,
            }}
          >
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CategorySelect;
