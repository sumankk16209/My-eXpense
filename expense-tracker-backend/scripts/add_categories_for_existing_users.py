#!/usr/bin/env python3
"""
Script to add default categories for existing users who don't have categories
"""

import asyncio
from sqlalchemy import text
from data_sources.database import engine, SessionLocal
import data_sources.models as models

async def add_categories_for_existing_users():
    """Add default categories for existing users who don't have any"""
    try:
        with engine.connect() as conn:
            # Check if tables exist
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name IN ('users', 'categories')
            """))
            tables_exist = len(result.fetchall()) == 2
            
            if not tables_exist:
                print("❌ Required tables don't exist yet. Run migrations first.")
                return False
            
            # Get all users
            result = conn.execute(text("SELECT id, username FROM users"))
            users = result.fetchall()
            
            if not users:
                print("❌ No users found")
                return False
            
            print(f"Found {len(users)} users")
            
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
            
            categories_added = 0
            
            for user_id, username in users:
                # Check if user already has categories
                result = conn.execute(text("""
                    SELECT COUNT(*) FROM categories WHERE user_id = :user_id
                """), {"user_id": user_id})
                existing_categories = result.fetchone()[0]
                
                if existing_categories == 0:
                    print(f"Adding categories for user: {username} (ID: {user_id})")
                    
                    # Create categories for this user
                    for category_data in default_categories:
                        conn.execute(text("""
                            INSERT INTO categories (name, description, color, user_id)
                            VALUES (:name, :description, :color, :user_id)
                        """), {**category_data, "user_id": user_id})
                    
                    categories_added += len(default_categories)
                else:
                    print(f"User {username} already has {existing_categories} categories")
            
            if categories_added > 0:
                conn.commit()
                print(f"✅ Added {categories_added} categories for existing users")
            else:
                print("✅ All users already have categories")
            
            return True
            
    except Exception as e:
        print(f"❌ Error adding categories for existing users: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Adding default categories for existing users...")
    asyncio.run(add_categories_for_existing_users())
