import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getExpenses } from '../api';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'
];

function ExpenseCharts() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [chartDimensions, setChartDimensions] = useState({ width: 500, height: 300 });

  useEffect(() => {
    fetchExpenses();
    updateChartDimensions();
    
    // Update dimensions on window resize
    const handleResize = () => updateChartDimensions();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateChartDimensions = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setChartDimensions({ width: 350, height: 250 });
    } else {
      setChartDimensions({ width: 500, height: 300 });
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      console.log('Fetched expenses:', data); // Debug log
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchExpenses();
  };

  // Process expenses data for charts
  const processChartData = () => {
    const categoryTotals = {};
    
    console.log('Processing expenses:', expenses); // Debug log
    
    expenses.forEach(expense => {
      console.log('Processing expense:', expense); // Debug individual expense
      const categoryName = expense.category_name;
      console.log('Category name:', categoryName); // Debug category name
      
      if (categoryTotals[categoryName]) {
        categoryTotals[categoryName] += expense.amount;
      } else {
        categoryTotals[categoryName] = expense.amount;
      }
    });

    const result = Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      color: COLORS[index % COLORS.length]
    }));

    console.log('Processed chart data:', result); // Debug log
    console.log('Category totals:', categoryTotals); // Debug category totals
    return result;
  };

  const chartData = processChartData();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (chartData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No expenses found to display charts
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ mt: 2 }}
        >
          Refresh
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Expense Summary by Category</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              label="Chart Type"
              onChange={(e) => setChartType(e.target.value)}
            >
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="pie">Pie Chart</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Debug info */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          Debug: {chartData.length} categories, Total: ₹{chartData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Box sx={{ width: '100%', height: 400, border: '1px solid #e0e0e0', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {chartData.length > 0 ? (
              <>
                {/* Try ResponsiveContainer first */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                  {chartType === 'bar' ? (
                    <BarChart 
                      width={chartDimensions.width} 
                      height={chartDimensions.height} 
                      data={chartData} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Amount']}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Amount (₹)" />
                    </BarChart>
                  ) : (
                    <PieChart width={chartDimensions.width * 0.7} height={chartDimensions.height}>
                      <Pie
                        data={chartData}
                        cx={(chartDimensions.width * 0.7) / 2}
                        cy={chartDimensions.height / 2}
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={Math.min(chartDimensions.width, chartDimensions.height) * 0.3}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Amount']}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                    </PieChart>
                  )}
                </Box>
                
                {/* Fallback: Simple text representation if charts fail */}
                <Box sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.9)', p: 1, borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Chart Type: {chartType}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="textSecondary">No data available for charts</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Summary Statistics */}
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h6" gutterBottom>Category Breakdown</Typography>
            
            {chartData.map((category, index) => (
              <Box key={category.name} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {category.name}
                  </Typography>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: category.color
                    }}
                  />
                </Box>
                
                <Typography variant="h6" color="primary">
                  ₹{category.value.toFixed(2)}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  {((category.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of total
                </Typography>
              </Box>
            ))}
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>Total Expenses</Typography>
              <Typography variant="h5" color="primary">
                ₹{chartData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ExpenseCharts;
