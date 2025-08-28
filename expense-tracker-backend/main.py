from fastapi import FastAPI
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func

from data_sources.database import SessionLocal
import data_sources.models as models
import schema.schemas as schemas
from auth import get_current_active_user
from routers import auth
from logic.ai_logic import forecaster
from api import categories, expenses, ai, investments

# Note: Tables are now managed by Alembic migrations

app = FastAPI(
    title="Expense Tracker API",
    description="A secure expense tracking API with OAuth2.0 authentication",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",  # Adjust this to your frontend URL
    "http://127.0.0.1:5173", # For vite default server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(categories.router) # Include new router
app.include_router(expenses.router) # Include new router
app.include_router(ai.router) # Include new router
app.include_router(investments.router) # Include new router

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# AI Forecasting Endpoints
