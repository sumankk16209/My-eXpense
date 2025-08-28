from pydantic import BaseModel, ConfigDict, EmailStr, validator
from enum import Enum
from datetime import date, datetime
from typing import Optional, Union

# Authentication Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[str] = None

class User(UserBase):
    id: int
    is_active: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class UserInDB(User):
    hashed_password: str

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str

class TokenData(BaseModel):
    username: Optional[str] = None

class RefreshToken(BaseModel):
    refresh_token: str

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# Expense Schemas
class ExpenseBase(BaseModel):
    description: str
    amount: float
    date: date
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    
    # @validator('category_id', 'category_name', always=True)
    # def validate_category(cls, v, values):
    #     # Either category_id or category_name must be provided
    #     if 'category_id' not in values and 'category_name' not in values:
    #         raise ValueError('Either category_id or category_name must be provided')
    #     return v

class ExpenseUpdate(ExpenseBase):
    category_id: Optional[int] = None
    category_name: Optional[str] = None

class Expense(ExpenseBase):
    id: int
    category_id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ExpenseResponse(Expense):
    category: Category
    category_name: str

# Summary Schemas
class ExpenseSummary(BaseModel):
    first_expense_date: Optional[date] = None
    latest_expense_date: Optional[date] = None
    total_expenses: int
    total_amount: float

# Investment Types
class InvestmentType(str, Enum):
    SIP = "SIP"
    STOCKS = "Stocks"
    LIC = "LIC"
    MUTUAL_FUNDS = "Mutual Funds"
    FIXED_DEPOSIT = "Fixed Deposit"
    GOLD = "Gold"
    REAL_ESTATE = "Real Estate"
    CRYPTO = "Cryptocurrency"
    BONDS = "Bonds"
    PPF = "PPF"
    NPS = "NPS"
    OTHER = "Other"

# Investment Status
class InvestmentStatus(str, Enum):
    ACTIVE = "Active"
    PAUSED = "Paused"
    COMPLETED = "Completed"
    SOLD = "Sold"
    MATURED = "Matured"

# Investment Base Schema
class InvestmentBase(BaseModel):
    name: str
    investment_type: InvestmentType
    amount: float
    date: date
    status: InvestmentStatus = InvestmentStatus.ACTIVE
    description: Optional[str] = None
    institution: Optional[str] = None
    account_number: Optional[str] = None
    folio_number: Optional[str] = None
    units: Optional[float] = None
    nav: Optional[float] = None
    maturity_date: Optional[date] = None
    interest_rate: Optional[float] = None
    frequency: Optional[str] = None  # For SIP: Monthly, Quarterly, etc.
    is_sip: bool = False
    sip_amount: Optional[float] = None
    sip_frequency: Optional[str] = None

# Investment Create Schema
class InvestmentCreate(InvestmentBase):
    pass

# Investment Update Schema
class InvestmentUpdate(BaseModel):
    name: Optional[str] = None
    investment_type: Optional[InvestmentType] = None
    amount: Optional[float] = None
    date: Optional[date] = None
    status: Optional[InvestmentStatus] = None
    description: Optional[str] = None
    institution: Optional[str] = None
    account_number: Optional[str] = None
    folio_number: Optional[str] = None
    units: Optional[float] = None
    nav: Optional[float] = None
    maturity_date: Optional[date] = None
    interest_rate: Optional[float] = None
    frequency: Optional[str] = None
    is_sip: Optional[bool] = None
    sip_amount: Optional[float] = None
    sip_frequency: Optional[str] = None

# Investment Response Schema
class Investment(InvestmentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# Investment Summary Schema
class InvestmentSummary(BaseModel):
    total_investments: int
    total_amount: float
    total_sip_amount: float
    active_investments: int
    paused_investments: int
    completed_investments: int
    investments_by_type: dict
    recent_investments: list
    upcoming_maturities: list
