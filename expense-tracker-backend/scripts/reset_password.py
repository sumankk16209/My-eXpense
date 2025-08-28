#!/usr/bin/env python3
"""
Script to reset a user's password.
"""

import os
import sys
from sqlalchemy import create_engine, text
from passlib.context import CryptContext

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_sources.database import DATABASE_URL

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)

def reset_user_password(username: str, new_password: str):
    """Reset password for a specific user."""
    
    print(f"🔐 Resetting password for user: {username}")
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # Check if user exists
            result = conn.execute(text("""
                SELECT id, username, email, full_name
                FROM users
                WHERE username = :username;
            """), {"username": username})
            
            user = result.fetchone()
            
            if not user:
                print(f"❌ User '{username}' not found!")
                return False
            
            print(f"✅ Found user: {user[3]} ({user[2]})")
            
            # Hash the new password
            hashed_password = hash_password(new_password)
            
            # Update the password
            conn.execute(text("""
                UPDATE users 
                SET hashed_password = :hashed_password
                WHERE username = :username;
            """), {
                "hashed_password": hashed_password,
                "username": username
            })
            
            conn.commit()
            print(f"✅ Password updated successfully for user '{username}'")
            print(f"🔑 New password: {new_password}")
            print("\n💡 You can now log in with this password!")
            
            return True
            
    except Exception as e:
        print(f"❌ Error resetting password: {e}")
        return False
    finally:
        engine.dispose()

def main():
    """Main function to reset password."""
    
    print("🔐 Password Reset Tool")
    print("=" * 40)
    
    # Show available users
    engine = create_engine(DATABASE_URL)
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT username, email, full_name
                FROM users
                ORDER BY id;
            """))
            
            users = result.fetchall()
            
            print(f"\n👥 Available users:")
            for i, user in enumerate(users, 1):
                print(f"{i}. {user[0]} ({user[2]}) - {user[1]}")
            
            print("\n" + "=" * 40)
            
            # Get user choice
            while True:
                try:
                    choice = int(input("Select user number (or 0 to exit): "))
                    if choice == 0:
                        print("👋 Exiting...")
                        return
                    if 1 <= choice <= len(users):
                        break
                    print("❌ Invalid choice. Please try again.")
                except ValueError:
                    print("❌ Please enter a valid number.")
            
            selected_user = users[choice - 1]
            username = selected_user[0]
            
            # Get new password
            new_password = input(f"Enter new password for {username}: ")
            
            if not new_password:
                print("❌ Password cannot be empty!")
                return
            
            # Reset password
            reset_user_password(username, new_password)
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        engine.dispose()

if __name__ == "__main__":
    main()
