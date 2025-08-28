
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from data_sources.database import get_db
import data_sources.models as models
import schema.schemas as schemas
from auth import get_current_active_user

router = APIRouter(prefix="/investments", tags=["investments"])

@router.get("/summary", response_model=schemas.InvestmentSummary)
def get_investments_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get investment summary for the current user"""
    investments = db.query(models.Investment).filter(
        models.Investment.user_id == current_user.id
    ).all()

    if not investments:
        return schemas.InvestmentSummary(
            total_investments=0,
            total_amount=0.0,
            total_sip_amount=0.0,
            active_investments=0,
            paused_investments=0,
            completed_investments=0,
            investments_by_type={},
            recent_investments=[],
            upcoming_maturities=[]
        )

    # Calculate totals
    total_amount = sum(inv.amount for inv in investments)
    total_sip_amount = sum(inv.sip_amount or 0 for inv in investments if inv.is_sip)
    
    # Count by status
    active_investments = len([inv for inv in investments if inv.status == "Active"])
    paused_investments = len([inv for inv in investments if inv.status == "Paused"])
    completed_investments = len([inv for inv in investments if inv.status in ["Completed", "Sold", "Matured"]])
    
    # Group by type
    investments_by_type = {}
    for inv in investments:
        inv_type = inv.investment_type
        if inv_type not in investments_by_type:
            investments_by_type[inv_type] = {
                "count": 0,
                "total_amount": 0.0,
                "investments": []
            }
        investments_by_type[inv_type]["count"] += 1
        investments_by_type[inv_type]["total_amount"] += inv.amount
        investments_by_type[inv_type]["investments"].append({
            "id": inv.id,
            "name": inv.name,
            "amount": inv.amount,
            "date": inv.date,
            "status": inv.status
        })

    # Recent investments (last 5)
    recent_investments = sorted(investments, key=lambda x: x.date, reverse=True)[:5]
    recent_investments_data = [
        {
            "id": inv.id,
            "name": inv.name,
            "amount": inv.amount,
            "date": inv.date,
            "type": inv.investment_type,
            "status": inv.status
        }
        for inv in recent_investments
    ]

    # Upcoming maturities (next 30 days)
    today = datetime.now().date()
    upcoming_maturities = [
        {
            "id": inv.id,
            "name": inv.name,
            "amount": inv.amount,
            "maturity_date": inv.maturity_date,
            "days_remaining": (inv.maturity_date - today).days
        }
        for inv in investments
        if inv.maturity_date and inv.maturity_date >= today and inv.status == "Active"
    ]
    upcoming_maturities.sort(key=lambda x: x["maturity_date"])

    return schemas.InvestmentSummary(
        total_investments=len(investments),
        total_amount=total_amount,
        total_sip_amount=total_sip_amount,
        active_investments=active_investments,
        paused_investments=paused_investments,
        completed_investments=completed_investments,
        investments_by_type=investments_by_type,
        recent_investments=recent_investments_data,
        upcoming_maturities=upcoming_maturities
    )

@router.post("/", response_model=schemas.Investment)
def create_investment(
    investment: schemas.InvestmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new investment"""
    db_investment = models.Investment(
        name=investment.name,
        investment_type=investment.investment_type,
        amount=investment.amount,
        date=investment.date,
        status=investment.status,
        description=investment.description,
        institution=investment.institution,
        account_number=investment.account_number,
        folio_number=investment.folio_number,
        units=investment.units,
        nav=investment.nav,
        maturity_date=investment.maturity_date,
        interest_rate=investment.interest_rate,
        frequency=investment.frequency,
        is_sip=investment.is_sip,
        sip_amount=investment.sip_amount,
        sip_frequency=investment.sip_frequency,
        user_id=current_user.id
    )
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    return db_investment

@router.get("/", response_model=List[schemas.Investment])
def read_investments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get all investments for the current user"""
    investments = db.query(models.Investment).filter(
        models.Investment.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return investments

@router.get("/{investment_id}", response_model=schemas.Investment)
def read_investment(
    investment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get a specific investment by ID"""
    investment = db.query(models.Investment).filter(
        models.Investment.id == investment_id,
        models.Investment.user_id == current_user.id
    ).first()
    if investment is None:
        raise HTTPException(status_code=404, detail="Investment not found")
    return investment

@router.put("/{investment_id}", response_model=schemas.Investment)
def update_investment(
    investment_id: int,
    investment: schemas.InvestmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Update an existing investment"""
    db_investment = db.query(models.Investment).filter(
        models.Investment.id == investment_id,
        models.Investment.user_id == current_user.id
    ).first()
    if db_investment is None:
        raise HTTPException(status_code=404, detail="Investment not found")

    update_data = investment.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_investment, field, value)

    db.commit()
    db.refresh(db_investment)
    return db_investment

@router.delete("/{investment_id}")
def delete_investment(
    investment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Delete an investment"""
    db_investment = db.query(models.Investment).filter(
        models.Investment.id == investment_id,
        models.Investment.user_id == current_user.id
    ).first()
    if db_investment is None:
        raise HTTPException(status_code=404, detail="Investment not found")

    db.delete(db_investment)
    db.commit()
    return {"message": "Investment deleted successfully"}
