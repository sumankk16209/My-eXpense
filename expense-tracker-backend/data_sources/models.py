from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Date, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(String, default="active")  # active, inactive, suspended
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    expenses = relationship("Expense", back_populates="user")
    categories = relationship("Category", back_populates="user")
    investments = relationship("Investment", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    color = Column(String, nullable=True)  # Hex color code
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="categories")
    expenses = relationship("Expense", back_populates="category")

class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="expenses")
    user = relationship("User", back_populates="expenses")

class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    investment_type = Column(String, nullable=False)  # SIP, Stocks, LIC, Mutual Funds, etc.
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, default="Active")  # Active, Paused, Completed, Sold, Matured
    description = Column(Text, nullable=True)
    institution = Column(String, nullable=True)  # Bank, AMC, Broker, etc.
    account_number = Column(String, nullable=True)
    folio_number = Column(String, nullable=True)
    units = Column(Float, nullable=True)  # For mutual funds, stocks
    nav = Column(Float, nullable=True)  # Net Asset Value
    maturity_date = Column(Date, nullable=True)
    interest_rate = Column(Float, nullable=True)
    frequency = Column(String, nullable=True)  # Monthly, Quarterly, etc.
    is_sip = Column(Boolean, default=False)
    sip_amount = Column(Float, nullable=True)
    sip_frequency = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="investments")
