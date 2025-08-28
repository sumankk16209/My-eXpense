#!/usr/bin/env python3
"""
Script to check existing users in the database.
"""

import os
import sys
from sqlalchemy import create_engine, text

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_sources.database import DATABASE_URL

def check_users():
    """Check what users exist in the database."""
    
    print("🔍 Checking existing users in the database...")
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Check if users table exists
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name = 'users';
            """))
            
            if not result.fetchone():
                print("❌ Users table does not exist!")
                return
            
            # Get all users
            result = conn.execute(text("""
                SELECT id, username, email, full_name, is_active, created_at
                FROM users
                ORDER BY id;
            """))
            
            users = result.fetchall()
            
            if not users:
                print("❌ No users found in the database!")
                print("\n💡 You need to create a user first.")
                print("   Run: python3 create_default_user.py")
                return
            
            print(f"✅ Found {len(users)} user(s) in the database:")
            print("\n" + "="*80)
            print(f"{'ID':<5} {'Username':<20} {'Email':<30} {'Full Name':<20} {'Status':<10}")
            print("="*80)
            
            for user in users:
                status = "✅ Active" if user[4] else "❌ Inactive"
                print(f"{user[0]:<5} {user[1]:<20} {user[2]:<30} {user[3]:<20} {status}")
            
            print("="*80)
            
            # Show login instructions
            print("\n🔑 To log in to the application:")
            print("1. Open your browser and go to: http://localhost:5173")
            print("2. Use one of the usernames above")
            print("3. Enter your password")
            print("4. After login, you can access the investments page")
            
            # Check if there's a default user
            default_user = next((u for u in users if u[1] == 'default_user'), None)
            if default_user:
                print(f"\n💡 Default user found: {default_user[1]}")
                print("   This user was created by the setup script.")
                print("   You may need to set a password for this user.")
            
    except Exception as e:
        print(f"❌ Error checking users: {e}")
    finally:
        engine.dispose()

if __name__ == "__main__":
    check_users()
