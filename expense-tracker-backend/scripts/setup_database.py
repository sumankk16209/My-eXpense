#!/usr/bin/env python3
"""
Comprehensive database setup script for Expense Tracker
"""

import asyncio
import subprocess
import sys
import os

async def run_setup():
    """Run all database setup steps"""
    print("🚀 Setting up Expense Tracker Database...")
    print("=" * 50)
    
    # Step 1: Run Alembic migrations
    print("\n📋 Step 1: Running database migrations...")
    try:
        result = subprocess.run([
            sys.executable, "-m", "alembic", "upgrade", "head"
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print("✅ Database migrations completed successfully")
        else:
            print(f"❌ Migration failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False
    
    # Step 2: Create default user if needed
    print("\n👤 Step 2: Creating default user...")
    try:
        result = subprocess.run([
            sys.executable, "create_default_user.py"
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print("✅ Default user setup completed")
        else:
            print(f"⚠️  Default user setup had issues: {result.stderr}")
    except Exception as e:
        print(f"⚠️  Error creating default user: {e}")
    
    # Step 3: Add categories for existing users
    print("\n🏷️  Step 3: Setting up default categories...")
    try:
        result = subprocess.run([
            sys.executable, "add_categories_for_existing_users.py"
        ], capture_output=True, text=True, cwd=os.getcwd())
        
        if result.returncode == 0:
            print("✅ Default categories setup completed")
        else:
            print(f"⚠️  Categories setup had issues: {result.stderr}")
    except Exception as e:
        print(f"⚠️  Error setting up categories: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Database setup completed!")
    print("\n📝 Next steps:")
    print("1. Start the FastAPI server: python main.py")
    print("2. The frontend should now be able to create expenses")
    print("3. Categories will be automatically created for new users")
    
    return True

if __name__ == "__main__":
    asyncio.run(run_setup())
