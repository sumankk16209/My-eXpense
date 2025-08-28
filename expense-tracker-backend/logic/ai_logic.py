"""
AI-Powered Expense Forecasting System
Uses machine learning to predict monthly expenses based on historical patterns
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import logging
from sqlalchemy.orm import Session
from data_sources.ai_data import get_expenses_for_forecasting, get_recent_expenses_for_insights, get_similar_months_expenses
import warnings
warnings.filterwarnings('ignore')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ExpenseForecaster:
    """AI-powered expense forecasting system"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_columns = [
            'month', 'day_of_month', 'day_of_week', 'is_weekend',
            'days_since_start', 'category_encoded', 'amount_log'
        ]
        
    def prepare_features(self, expenses_data: List[Dict]) -> pd.DataFrame:
        """Prepare features from expense data for machine learning"""
        if not expenses_data:
            return pd.DataFrame()
            
        df = pd.DataFrame(expenses_data)
        df['date'] = pd.to_datetime(df['date'])
        
        # Extract temporal features
        df['month'] = df['date'].dt.month
        df['day_of_month'] = df['date'].dt.day
        df['day_of_week'] = df['date'].dt.dayofweek
        df['is_weekend'] = df['date'].dt.dayofweek.isin([5, 6]).astype(int)
        
        # Calculate days since tracking started
        start_date = df['date'].min()
        df['days_since_start'] = (df['date'] - start_date).dt.days
        
        # Encode categories
        category_mapping = {cat: idx for idx, cat in enumerate(df['category_name'].unique())}
        df['category_encoded'] = df['category_name'].map(category_mapping)
        
        # Log transform amount for better distribution
        df['amount_log'] = np.log1p(df['amount'])
        
        # Select only feature columns
        feature_df = df[self.feature_columns].copy()
        
        # Handle missing values
        feature_df = feature_df.fillna(0)
        
        return feature_df
    
    def train_model(self, expenses_data: List[Dict]) -> Dict:
        """Train the forecasting model on historical expense data"""
        try:
            if len(expenses_data) < 10:
                return {
                    'success': False,
                    'message': 'Need at least 10 expenses to train the model',
                    'metrics': {}
                }
            
            # Prepare features
            feature_df = self.prepare_features(expenses_data)
            if feature_df.empty:
                return {
                    'success': False,
                    'message': 'Failed to prepare features',
                    'metrics': {}
                }
            
            # Prepare target (next day's total expense)
            df = pd.DataFrame(expenses_data)
            df['date'] = pd.to_datetime(df['date'])
            daily_expenses = df.groupby('date')['amount'].sum().reset_index()
            daily_expenses = daily_expenses.sort_values('date')
            
            # Create target: next day's total expense
            daily_expenses['next_day_amount'] = daily_expenses['amount'].shift(-1)
            
            # Merge features with targets
            feature_df['date'] = df['date'].dt.date
            merged_df = feature_df.merge(daily_expenses[['date', 'next_day_amount']], 
                                       left_on='date', right_on='date', how='left')
            
            # Remove rows with missing targets
            merged_df = merged_df.dropna(subset=['next_day_amount'])
            
            if len(merged_df) < 5:
                return {
                    'success': False,
                    'message': 'Insufficient data for training after feature preparation',
                    'metrics': {}
                }
            
            # Prepare X and y
            X = merged_df[self.feature_columns].values
            y = merged_df['next_day_amount'].values
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            
            self.model.fit(X_train_scaled, y_train)
            
            # Make predictions
            y_pred = self.model.predict(X_test_scaled)
            
            # Calculate metrics
            mae = mean_absolute_error(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            r2 = r2_score(y_test, y_pred)
            
            self.is_trained = True
            
            return {
                'success': True,
                'message': 'Model trained successfully',
                'metrics': {
                    'mae': round(mae, 2),
                    'mse': round(mse, 2),
                    'rmse': round(rmse, 2),
                    'r2': round(r2, 3),
                    'training_samples': len(X_train),
                    'test_samples': len(X_test)
                }
            }
            
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            return {
                'success': False,
                'message': f'Training failed: {str(e)}',
                'metrics': {}
            }
    
    def predict_monthly_expenses(self, user_id: int, db: Session, 
                               months_ahead: int = 1) -> Dict:
        """Predict monthly expenses for the next few months"""
        try:
            if not self.is_trained:
                return {
                    'success': False,
                    'message': 'Model not trained. Please train first.',
                    'predictions': []
                }
            
            # Get user's historical expenses
            expenses_data = get_expenses_for_forecasting(db, user_id)
            if not expenses_data:
                return {
                    'success': False,
                    'message': 'No historical expenses found',
                    'predictions': []
                }
            
            # Get current date info
            current_date = datetime.now()
            current_month = current_date.month
            current_year = current_date.year
            
            predictions = []
            
            for month_offset in range(1, months_ahead + 1):
                # Calculate target month
                target_date = current_date + timedelta(days=30 * month_offset)
                target_month = target_date.month
                target_year = target_date.year
                
                # Generate features for prediction
                month_features = self._generate_month_features(
                    target_month, target_year, user_id, db
                )
                
                if month_features is not None:
                    # Scale features
                    features_scaled = self.scaler.transform([month_features])
                    
                    # Make prediction
                    predicted_amount = self.model.predict(features_scaled)[0]
                    
                    # Ensure prediction is reasonable
                    predicted_amount = max(0, predicted_amount)
                    
                    predictions.append({
                        'month': target_month,
                        'year': target_year,
                        'month_name': target_date.strftime('%B %Y'),
                        'predicted_amount': round(predicted_amount, 2),
                        'confidence': self._calculate_confidence(month_features)
                    })
            
            return {
                'success': True,
                'message': f'Generated {len(predictions)} month predictions',
                'predictions': predictions
            }
            
        except Exception as e:
            logger.error(f"Error predicting monthly expenses: {str(e)}")
            return {
                'success': False,
                'message': f'Prediction failed: {str(e)}',
                'predictions': []
            }
    
    def _generate_month_features(self, month: int, year: int, 
                               user_id: int, db: Session) -> Optional[List[float]]:
        """Generate features for a specific month"""
        try:
            # Get historical data for similar months
            similar_months_data = get_similar_months_expenses(db, user_id, month, year)
            
            if not similar_months_data:
                return None
            
            # Calculate average features for this month
            df = pd.DataFrame(similar_months_data)
            
            # Encode category (use most common category for this month)
            most_common_category = df['category_name'].mode().iloc[0] if not df.empty else 'Other'
            category_mapping = {cat: idx for idx, cat in enumerate(df['category_name'].unique())}
            category_encoded = category_mapping.get(most_common_category, 0)
            
            # Calculate average amount and log transform
            avg_amount = df['amount'].mean() if not df.empty else 0
            amount_log = np.log1p(avg_amount)
            
            # Generate features for the target month
            target_date = datetime(year, month, 15)  # Middle of month
            start_date = datetime(2020, 1, 1)  # Arbitrary start date
            
            features = [
                month,  # month
                15,     # day_of_month (middle of month)
                target_date.weekday(),  # day_of_week
                0,      # is_weekend (will be calculated)
                (target_date - start_date).days,  # days_since_start
                category_encoded,  # category_encoded
                amount_log  # amount_log
            ]
            
            # Calculate if it's weekend
            features[3] = 1 if target_date.weekday() in [5, 6] else 0
            
            return features
            
        except Exception as e:
            logger.error(f"Error generating month features: {str(e)}")
            return None
    
    def _calculate_confidence(self, features: List[float]) -> float:
        """Calculate confidence score for prediction"""
        try:
            # Simple confidence based on feature quality
            # Higher confidence for more recent months, lower for future months
            current_month = datetime.now().month
            predicted_month = features[0]
            
            month_diff = abs(predicted_month - current_month)
            
            if month_diff == 0:
                confidence = 0.9  # Current month
            elif month_diff == 1:
                confidence = 0.8  # Next month
            elif month_diff == 2:
                confidence = 0.7  # Two months ahead
            else:
                confidence = max(0.5, 0.9 - (month_diff * 0.1))  # Decreasing confidence
            
            return round(confidence, 2)
            
        except Exception as e:
            logger.error(f"Error calculating confidence: {str(e)}")
            return 0.5
    
    def get_spending_insights(self, user_id: int, db: Session) -> Dict:
        """Generate spending insights and recommendations"""
        try:
            # Get recent expenses
            recent_expenses_data = get_recent_expenses_for_insights(db, user_id)
            
            if not recent_expenses_data:
                return {
                    'success': False,
                    'message': 'No recent expenses for insights',
                    'insights': []
                }
            
            df = pd.DataFrame(recent_expenses_data)
            
            insights = []
            
            # Spending trend
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.to_period('M')
            monthly_spending = df.groupby('month')['amount'].sum()
            
            if len(monthly_spending) >= 2:
                recent_months = monthly_spending.tail(2)
                if len(recent_months) == 2:
                    change = recent_months.iloc[-1] - recent_months.iloc[-2]
                    change_percent = (change / recent_months.iloc[-2]) * 100
                    
                    if change > 0:
                        insights.append({
                            'type': 'trend',
                            'title': 'Spending Increase',
                            'message': f'Your spending increased by ₹{abs(change):.0f} ({abs(change_percent):.1f}%) compared to last month',
                            'severity': 'warning' if change_percent > 20 else 'info'
                        })
                    else:
                        insights.append({
                            'type': 'trend',
                            'title': 'Spending Decrease',
                            'message': f'Great job! Your spending decreased by ₹{abs(change):.0f} ({abs(change_percent):.1f}%) compared to last month',
                            'severity': 'success'
                        })
            
            # Category analysis
            category_spending = df.groupby('category_name')['amount'].sum().sort_values(ascending=False)
            top_category = category_spending.index[0]
            top_amount = category_spending.iloc[0]
            total_spending = category_spending.sum()
            top_percentage = (top_amount / total_spending) * 100
            
            if top_percentage > 40:
                insights.append({
                    'type': 'category',
                    'title': 'High Category Concentration',
                    'message': f'{top_category} accounts for {top_percentage:.1f}% of your spending. Consider diversifying expenses.',
                    'severity': 'warning'
                })
            
            # Budget recommendations
            avg_monthly = df.groupby(df['date'].dt.to_period('M'))['amount'].sum().mean()
            if avg_monthly > 50000:  # ₹50,000 threshold
                insights.append({
                    'type': 'budget',
                    'title': 'High Monthly Spending',
                    'message': f'Your average monthly spending is ₹{avg_monthly:.0f}. Consider setting a budget to control expenses.',
                    'severity': 'warning'
                })
            
            return {
                'success': True,
                'message': f'Generated {len(insights)} insights',
                'insights': insights
            }
            
        except Exception as e:
            logger.error(f"Error generating insights: {str(e)}")
            return {
                'success': False,
                'message': f'Insights generation failed: {str(e)}',
                'insights': []
            }
    
    def save_model(self, filepath: str) -> bool:
        """Save the trained model to disk"""
        try:
            if not self.is_trained:
                return False
            
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'feature_columns': self.feature_columns,
                'trained_date': datetime.now()
            }
            
            joblib.dump(model_data, filepath)
            return True
            
        except Exception as e:
            logger.error(f"Error saving model: {str(e)}")
            return False
    
    def load_model(self, filepath: str) -> bool:
        """Load a trained model from disk"""
        try:
            model_data = joblib.load(filepath)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.feature_columns = model_data['feature_columns']
            self.is_trained = True
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            return False

# Global forecaster instance
forecaster = ExpenseForecaster()
