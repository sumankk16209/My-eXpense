
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from sqlalchemy import func

from data_sources.database import get_db
import data_sources.models as models
import schema.schemas as schemas
from auth import get_current_active_user

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.post("/", response_model=schemas.ExpenseResponse)
def create_expense(
    expense: schemas.ExpenseCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    # Handle category lookup - either by ID or name
    print("My expense list: ", expense)
    category = None
    if expense.category_id:
        # Look up by ID
        category = db.query(models.Category).filter(
            models.Category.id == expense.category_id,
            models.Category.user_id == current_user.id
        ).first()
    elif expense.category_name:
        # Look up by name
        category = db.query(models.Category).filter(
            models.Category.name == expense.category_name,
            models.Category.user_id == current_user.id
        ).first()
    
    if not category:
        if expense.category_id:
            raise HTTPException(status_code=404, detail=f"Category with ID {expense.category_id} not found")
        else:
            raise HTTPException(status_code=404, detail=f"Category '{expense.category_name}' not found")
    
    db_expense = models.Expense(
        description=expense.description,
        amount=expense.amount,
        date=expense.date,
        notes=expense.notes,
        category_id=category.id,  # Use the found category's ID
        user_id=current_user.id
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    # Create response with category information
    return schemas.ExpenseResponse(
        id=db_expense.id,
        description=db_expense.description,
        amount=db_expense.amount,
        date=db_expense.date,
        notes=db_expense.notes,
        category_id=db_expense.category_id,
        user_id=db_expense.user_id,
        created_at=db_expense.created_at,
        updated_at=db_expense.updated_at,
        category=category,
        category_name=category.name
    )

@router.get("/", response_model=List[schemas.ExpenseResponse])
def read_expenses(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    expenses = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Convert to response schema with category information
    response_expenses = []
    for expense in expenses:
        response_expenses.append(schemas.ExpenseResponse(
            id=expense.id,
            description=expense.description,
            amount=expense.amount,
            date=expense.date,
            notes=expense.notes,
            category_id=expense.category_id,
            user_id=expense.user_id,
            created_at=expense.created_at,
            updated_at=expense.updated_at,
            category=expense.category,
            category_name=expense.category.name
        ))
    
    return response_expenses

@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
def read_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return schemas.ExpenseResponse(
        id=expense.id,
        description=expense.description,
        amount=expense.amount,
        date=expense.date,
        notes=expense.notes,
        category_id=expense.category_id,
        user_id=expense.user_id,
        created_at=expense.created_at,
        updated_at=expense.updated_at,
        category=expense.category,
        category_name=expense.category.name
    )

@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(
    expense_id: int, 
    expense: schemas.ExpenseUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Handle category lookup - either by ID or name
    category = None
    if expense.category_id:
        # Look up by ID
        category = db.query(models.Category).filter(
            models.Category.id == expense.category_id,
            models.Category.user_id == current_user.id
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail=f"Category with ID {expense.category_id} not found")
    elif expense.category_name:
        # Look up by name
        category = db.query(models.Category).filter(
            models.Category.name == expense.category_name,
            models.Category.user_id == current_user.id
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail=f"Category '{expense.category_name}' not found")
    
    # Update expense fields
    update_data = expense.dict(exclude_unset=True)
    
    # If we found a category, update the category_id
    if category:
        update_data['category_id'] = category.id
        # Remove category_name from update data since we're using category_id
        update_data.pop('category_name', None)
    
    for field, value in update_data.items():
        setattr(db_expense, field, value)
    
    db.commit()
    db.refresh(db_expense)
    
    # Get the updated category for response
    updated_category = db.query(models.Category).filter(
        models.Category.id == db_expense.category_id
    ).first()
    
    return schemas.ExpenseResponse(
        id=db_expense.id,
        description=db_expense.description,
        amount=db_expense.amount,
        date=db_expense.date,
        notes=db_expense.notes,
        category_id=db_expense.category_id,
        user_id=db_expense.user_id,
        created_at=db_expense.created_at,
        updated_at=db_expense.updated_at,
        category=updated_category,
        category_name=updated_category.name
    )

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id
    ).first()
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(db_expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

# Enhanced expense list endpoint
@router.get("/list/", response_model=List[schemas.ExpenseResponse])
def get_expenses_list(
    category_id: int = None,
    start_date: str = None,
    end_date: str = None,
    min_amount: float = None,
    max_amount: float = None,
    sort_by: str = "date",
    sort_order: str = "desc",
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Get a filtered and sorted list of expenses with additional query parameters.
    """
    query = db.query(models.Expense).filter(models.Expense.user_id == current_user.id)
    
    # Apply filters
    if category_id:
        query = query.filter(models.Expense.category_id == category_id)
    
    if start_date:
        query = query.filter(models.Expense.date >= start_date)
    
    if end_date:
        query = query.filter(models.Expense.date <= end_date)
    
    if min_amount is not None:
        query = query.filter(models.Expense.amount >= min_amount)
    
    if max_amount is not None:
        query = query.filter(models.Expense.amount <= max_amount)
    
    # Apply sorting
    if sort_by == "date":
        if sort_order == "asc":
            query = query.order_by(models.Expense.date.asc())
        else:
            query = query.order_by(models.Expense.date.desc())
    elif sort_by == "amount":
        if sort_order == "asc":
            query = query.order_by(models.Expense.amount.asc())
        else:
            query = query.order_by(models.Expense.amount.desc())
    elif sort_by == "description":
        if sort_order == "asc":
            query = query.order_by(models.Expense.description.asc())
        else:
            query = query.order_by(models.Expense.description.desc())
    
    # Apply pagination
    expenses = query.offset(skip).limit(limit).all()
    
    # Convert to response schema
    response_expenses = []
    for expense in expenses:
        response_expenses.append(schemas.ExpenseResponse(
            id=expense.id,
            description=expense.description,
            amount=expense.amount,
            date=expense.date,
            notes=expense.notes,
            category_id=expense.category_id,
            user_id=expense.user_id,
            created_at=expense.created_at,
            updated_at=expense.updated_at,
            category=expense.category,
            category_name=expense.category.name
        ))
    
    return response_expenses

# Get expenses by category
@router.get("/category/{category_name}/", response_model=List[schemas.ExpenseResponse])
def get_expenses_by_category(
    category_name: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Get all expenses for a specific category by name.
    """
    # First find the category
    category = db.query(models.Category).filter(
        models.Category.name == category_name,
        models.Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail=f"Category '{category_name}' not found")
    
    # Get expenses for this category
    expenses = db.query(models.Expense).filter(
        models.Expense.category_id == category.id,
        models.Expense.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Convert to response schema
    response_expenses = []
    for expense in expenses:
        response_expenses.append(schemas.ExpenseResponse(
            id=expense.id,
            description=expense.description,
            amount=expense.amount,
            date=expense.date,
            notes=expense.notes,
            category_id=expense.category_id,
            user_id=expense.user_id,
            created_at=expense.created_at,
            updated_at=expense.updated_at,
            category=expense.category,
            category_name=expense.category.name
        ))
    
    return response_expenses

# Summary endpoint
@router.get("/summary/", response_model=schemas.ExpenseSummary)
def get_expenses_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    first_expense = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).order_by(models.Expense.date).first()
    
    latest_expense = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).order_by(models.Expense.date.desc()).first()
    
    total_expenses_count = db.query(models.Expense).filter(
        models.Expense.user_id == current_user.id
    ).count()
    
    total_expenses_amount = db.query(func.sum(models.Expense.amount)).filter(
        models.Expense.user_id == current_user.id
    ).scalar() or 0.0

    return schemas.ExpenseSummary(
        first_expense_date=first_expense.date if first_expense else None,
        latest_expense_date=latest_expense.date if latest_expense else None,
        total_expenses=total_expenses_count,
        total_amount=total_expenses_amount,
    )
