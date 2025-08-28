
from sqlalchemy.orm import Session
from data_sources.models import Expense, Category
from typing import List, Dict

def get_expenses_for_forecasting(db: Session, user_id: int) -> List[Dict]:
    """Retrieve user's expenses for AI forecasting"""
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
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
    return expenses_data

def get_recent_expenses_for_insights(db: Session, user_id: int, days: int = 90) -> List[Dict]:
    """Retrieve user's recent expenses for AI insights"""
    from datetime import datetime, timedelta
    recent_expenses = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= datetime.now() - timedelta(days=days)
    ).all()
    expenses_data = []
    for exp in recent_expenses:
        expenses_data.append({
            'amount': exp.amount,
            'category_name': exp.category.name if exp.category else 'Other',
            'date': exp.date
        })
    return expenses_data

def get_similar_months_expenses(db: Session, user_id: int, month: int, year: int) -> List[Dict]:
    """Retrieve historical data for similar months for forecasting"""
    from datetime import datetime
    similar_months_data = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= datetime(year-2, month, 1),
        Expense.date < datetime(year+1, month, 1)
    ).all()
    expenses_data = []
    for exp in similar_months_data:
        expenses_data.append({
            'date': exp.date,
            'amount': exp.amount,
            'category_name': exp.category.name if exp.category else 'Other'
        })
    return expenses_data
