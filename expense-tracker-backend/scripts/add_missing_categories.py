#!/usr/bin/env python3
"""
Add missing categories with unique names for user 'Suman K K'
"""

from data_sources.database import SessionLocal
from data_sources.models import Category, User
from sqlalchemy import func

def add_missing_categories():
    """Add missing categories with unique names"""
    db = SessionLocal()
    try:
        # Get the user
        user = db.query(User).filter(User.username == 'Suman K K').first()
        
        if not user:
            print("❌ User 'Suman K K' not found")
            return False
        
        print(f"✅ Found user: {user.username} (ID: {user.id})")
        
        # Check existing categories
        existing_categories = db.query(Category).filter(Category.user_id == user.id).all()
        existing_names = [cat.name for cat in existing_categories]
        
        print(f"Current categories: {existing_names}")
        
        # Missing categories with unique names
        missing_categories = [
            {"name": "Food & Dining", "description": "Food and dining expenses", "color": "#FF6B6B"},
            {"name": "Home & Rent", "description": "Rent, mortgage, and housing expenses", "color": "#45B7D1"},
        ]
        
        print(f"🚀 Adding {len(missing_categories)} missing categories...")
        
        # Create missing categories
        for category_data in missing_categories:
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
                db.commit()
                print(f"  ✅ Added: {category_data['name']}")
                
            except Exception as e:
                print(f"  ❌ Failed to add {category_data['name']}: {e}")
                db.rollback()
                continue
        
        print(f"🎉 Finished adding missing categories for user {user.username}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Adding missing categories for user 'Suman K K'...")
    add_missing_categories()
