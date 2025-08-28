from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from data_sources.database import get_db
import data_sources.models as models
import schema.schemas as schemas
from logic.auth_logic import (
    get_password_hash,
    create_access_token,
    create_refresh_token,
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from data_sources.auth_data import authenticate_user
from auth import get_current_active_user # Keep this for router.get("/me")
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default categories for the new user
    default_categories = [
        {"name": "Food", "description": "Food and dining expenses", "color": "#FF6B6B"},
        {"name": "Transportation", "description": "Transport and travel expenses", "color": "#4ECDC4"},
        {"name": "Housing", "description": "Rent, mortgage, and housing expenses", "color": "#45B7D1"},
        {"name": "Utilities", "description": "Electricity, water, internet, etc.", "color": "#96CEB4"},
        {"name": "Entertainment", "description": "Movies, games, and leisure activities", "color": "#FFEAA7"},
        {"name": "Shopping", "description": "Clothing, electronics, and other purchases", "color": "#DDA0DD"},
        {"name": "Health", "description": "Medical expenses and healthcare", "color": "#98D8C8"},
        {"name": "Education", "description": "Books, courses, and learning materials", "color": "#F7DC6F"},
        {"name": "Salary", "description": "Income and salary", "color": "#82E0AA"},
        {"name": "Other", "description": "Miscellaneous expenses", "color": "#BB8FCE"}
    ]
    
    for category_data in default_categories:
        db_category = models.Category(
            name=category_data["name"],
            description=category_data["description"],
            color=category_data["color"],
            user_id=db_user.id
        )
        db.add(db_category)
    
    db.commit()
    
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login user and return access token"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 1800,  # 30 minutes in seconds
        "refresh_token": refresh_token
    }

@router.post("/refresh", response_model=schemas.Token)
def refresh_token(refresh_token: schemas.RefreshToken, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        payload = verify_token(refresh_token.refresh_token, "refresh")
        username: str = payload.get("sub")
        
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Check if user exists and is active
        user = db.query(models.User).filter(models.User.username == username).first()
        if not user or user.is_active != "active":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new tokens
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        new_refresh_token = create_refresh_token(data={"sub": user.username})
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": 1800,  # 30 minutes in seconds
            "refresh_token": new_refresh_token
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.get("/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@router.post("/logout")
def logout():
    """Logout user (client should discard tokens)"""
    return {"message": "Successfully logged out"}

@router.put("/profile", response_model=schemas.User)
def update_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    # Check if username is being changed and if it's already taken
    if user_update.username and user_update.username != current_user.username:
        db_user = db.query(models.User).filter(models.User.username == user_update.username).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Check if email is being changed and if it's already taken
    if user_update.email and user_update.email != current_user.email:
        db_user = db.query(models.User).filter(models.User.email == user_update.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
    
    # Update user fields
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return current_user
