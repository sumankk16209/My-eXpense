import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getExpenses, deleteExpense } from '../api';

function ExpenseList({ onEditSuccess }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    onEditSuccess(expense);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Expense List</Typography>
      <List>
      {console.log(expenses)}
        {expenses.map((expense) => (
          <ListItem key={expense.id} divider>
            <ListItemText
              primary={expense.description}
              secondary={`₹${expense.amount.toFixed(2)} - ${expense.category.name} (${new Date(expense.date).toLocaleDateString()})`}
            />
            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(expense)} sx={{ ml: 2 }}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(expense.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ExpenseList;
