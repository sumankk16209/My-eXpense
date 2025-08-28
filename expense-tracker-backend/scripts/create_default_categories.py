#!/usr/bin/env python3
"""
Script to create default categories for users
"""

import asyncio
from sqlalchemy import text
from data_sources.database import engine, SessionLocal
import data_sources.models as models

async def create_default_categories():
    """Create default categories for the system"""
    try:
        with engine.connect() as conn:
            # Check if categories table exists
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'categories'
            """))
            categories_table_exists = result.fetchone() is not None
            
            if not categories_table_exists:
                print("❌ Categories table doesn't exist yet. Run migrations first.")
                return False
            
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
            
            # Check if default categories already exist
            result = conn.execute(text("SELECT COUNT(*) FROM categories"))
            existing_count = result.fetchone()[0]
            
            if existing_count > 0:
                print(f"✅ Categories already exist ({existing_count} found)")
                return True
            
            # Create default categories
            for category_data in default_categories:
                conn.execute(text("""
                    INSERT INTO categories (name, description, color, user_id)
                    VALUES (:name, :description, :color, 1)
                """), category_data)
            
            conn.commit()
            print(f"✅ {len(default_categories)} default categories created successfully")
            return True
            
    except Exception as e:
        print(f"❌ Error creating default categories: {e}")
        return False

async def create_categories_for_user(user_id: int):
    """Create default categories for a specific user"""
    try:
        with engine.connect() as conn:
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
            
            # Create categories for the user
            for category_data in default_categories:
                conn.execute(text("""
                    INSERT INTO categories (name, description, color, user_id)
                    VALUES (:name, :description, :color, :user_id)
                """), {**category_data, "user_id": user_id})
            
            conn.commit()
            print(f"✅ {len(default_categories)} default categories created for user {user_id}")
            return True
            
    except Exception as e:
        print(f"❌ Error creating categories for user {user_id}: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Creating default categories...")
    asyncio.run(create_default_categories())
