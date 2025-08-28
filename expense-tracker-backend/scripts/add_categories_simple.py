#!/usr/bin/env python3
"""
Simple script to add categories for user 'Suman K K' one by one
"""

from data_sources.database import SessionLocal
from data_sources.models import Category, User
from sqlalchemy import func

def add_categories_for_user():
    """Add default categories for user 'Suman K K'"""
    db = SessionLocal()
    try:
        # Get the user
        user = db.query(User).filter(User.username == 'Suman K K').first()
        
        if not user:
            print("❌ User 'Suman K K' not found")
            return False
        
        print(f"✅ Found user: {user.username} (ID: {user.id})")
        
        # Check if user already has categories
        existing_categories = db.query(Category).filter(Category.user_id == user.id).count()
        
        if existing_categories > 0:
            print(f"✅ User already has {existing_categories} categories")
            return True
        
        # Default categories to create
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
        
        print(f"🚀 Creating {len(default_categories)} categories for user {user.username}...")
        
        # Create categories one by one
        for category_data in default_categories:
            try:
                # Get the next available ID
                max_id = db.query(func.max(Category.id)).scalar() or 0
                new_id = max_id + 1
                
                db_category = Category(
                    id=new_id,
                    name=category_data["name"],
                    description=category_data["description"],
                    color=category_data["color"],
                    user_id=user.id
                )
                db.add(db_category)
                db.commit()  # Commit each category individually
                print(f"  ✅ Added: {category_data['name']}")
                
            except Exception as e:
                print(f"  ❌ Failed to add {category_data['name']}: {e}")
                db.rollback()
                continue
        
        print(f"🎉 Finished creating categories for user {user.username}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Adding categories for user 'Suman K K'...")
    add_categories_for_user()
