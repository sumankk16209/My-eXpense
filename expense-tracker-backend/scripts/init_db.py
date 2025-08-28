#!/usr/bin/env python3
"""
Database initialization script for Expense Tracker
"""

import asyncio
from sqlalchemy import text
from data_sources.database import engine

async def init_database():
    """Initialize the database with basic setup"""
    try:
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            
            # Check if tables exist
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result]
            print(f"📋 Existing tables: {tables}")
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("Make sure PostgreSQL is running and accessible")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Initializing Expense Tracker Database...")
    asyncio.run(init_database())
