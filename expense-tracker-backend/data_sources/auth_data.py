
from typing import Optional
from sqlalchemy.orm import Session

import data_sources.models as models
from logic.auth_logic import verify_password

def authenticate_user(db: Session, username: str, password: str) -> Optional[models.User]:
    """Authenticate user with username and password"""
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if user.is_active != "active":
        return None
    return user

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    """Get user by username"""
    return db.query(models.User).filter(models.User.username == username).first()
