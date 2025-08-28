#!/usr/bin/env python3
"""
Script to create a default user for existing data migration
"""

import asyncio
from sqlalchemy import text
from data_sources.database import engine, SessionLocal
from auth import get_password_hash
import data_sources.models as models

async def create_default_user():
    """Create a default user for existing data"""
    try:
        with engine.connect() as conn:
            # Check if users table exists
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'users'
            """))
            users_table_exists = result.fetchone() is not None
            
            if not users_table_exists:
                print("❌ Users table doesn't exist yet. Run migrations first.")
                return False
            
            # Check if default user already exists
            result = conn.execute(text("SELECT id FROM users WHERE username = 'default_user'"))
            if result.fetchone():
                print("✅ Default user already exists")
                return True
            
            # Create default user
            hashed_password = get_password_hash("default123")
            conn.execute(text("""
                INSERT INTO users (email, username, hashed_password, full_name, is_active)
                VALUES ('default@example.com', 'default_user', :password, 'Default User', 'active')
            """), {"password": hashed_password})
            
            conn.commit()
            print("✅ Default user created successfully")
            return True
            
    except Exception as e:
        print(f"❌ Error creating default user: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Creating default user for data migration...")
    asyncio.run(create_default_user())
