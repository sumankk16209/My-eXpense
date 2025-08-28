
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Optional, Tuple

import data_sources.models as models
import schema.schemas as schemas
from data_sources.database import get_db
from auth import get_current_active_user
from logic.ai_logic import forecaster
from datetime import datetime, timedelta

router = APIRouter(prefix="/ai", tags=["AI Forecasting"])

@router.post("/train", response_model=dict)
def train_ai_model(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Train the AI forecasting model on user's historical data"""
    try:
        # Get user's expenses
        expenses = db.query(models.Expense).filter(
            models.Expense.user_id == current_user.id
        ).all()
        
        if not expenses:
            raise HTTPException(
                status_code=404, 
                detail="No expenses found. Please add some expenses first."
            )
        
        # Convert to dict format for AI module
        expenses_data = []
        for expense in expenses:
            expense_dict = {
                'id': expense.id,
                'description': expense.description,
                'amount': expense.amount,
                'date': expense.date,
                'category_name': expense.category.name if expense.category else 'Other',
                'user_id': expense.user_id
            }
            expenses_data.append(expense_dict)
        
        # Train the model
        result = forecaster.train_model(expenses_data)
        
        if result['success']:
            # Save the trained model
            model_path = f"models/user_{current_user.id}_forecast_model.pkl"
            forecaster.save_model(model_path)
            
            return {
                "message": "AI model trained successfully!",
                "training_metrics": result['metrics'],
                "model_saved": True
            }
        else:
            raise HTTPException(
                status_code=400,
                detail=result['message']
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Training failed: {str(e)}"
        )

@router.get("/forecast", response_model=dict)
def get_expense_forecast(
    months_ahead: int = 3,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get AI-powered expense forecast for upcoming months"""
    try:
        # Check if model is trained
        if not forecaster.is_trained:
            # Try to load existing model
            model_path = f"models/user_{current_user.id}_forecast_model.pkl"
            if not forecaster.load_model(model_path):
                raise HTTPException(
                    status_code=400,
                    detail="AI model not trained. Please train the model first using /ai/train endpoint."
                )
        
        # Get predictions
        result = forecaster.predict_monthly_expenses(
            user_id=current_user.id,
            db=db,
            months_ahead=min(months_ahead, 12)  # Max 12 months ahead
        )
        
        if result['success']:
            return {
                "message": result['message'],
                "predictions": result['predictions'],
                "forecast_date": datetime.now().isoformat(),
                "user_id": current_user.id
            }
        else:
            raise HTTPException(
                status_code=400,
                detail=result['message']
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Forecast failed: {str(e)}"
        )

@router.get("/insights", response_model=dict)
def get_spending_insights(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get AI-generated spending insights and recommendations"""
    try:
        result = forecaster.get_spending_insights(
            user_id=current_user.id,
            db=db
        )
        
        if result['success']:
            return {
                "message": result['message'],
                "insights": result['insights'],
                "generated_date": datetime.now().isoformat(),
                "user_id": current_user.id
            }
        else:
            raise HTTPException(
                status_code=400,
                detail=result['message']
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Insights generation failed: {str(e)}"
        )

@router.get("/status", response_model=dict)
def get_ai_status(
    current_user: models.User = Depends(get_current_active_user)
):
    """Get AI model status and training information"""
    try:
        model_path = f"models/user_{current_user.id}_forecast_model.pkl"
        
        return {
            "user_id": current_user.id,
            "model_trained": forecaster.is_trained,
            "model_saved": forecaster.load_model(model_path) if not forecaster.is_trained else True,
            "feature_columns": forecaster.feature_columns if forecaster.is_trained else [],
            "last_training": "Unknown"  # Could be enhanced to track training dates
        }
        
    except Exception as e:
        return {
            "user_id": current_user.id,
            "model_trained": False,
            "model_saved": False,
            "feature_columns": [],
            "last_training": "Unknown",
            "error": str(e)
        }
