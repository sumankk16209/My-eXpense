#!/usr/bin/env python3
"""
Script to migrate data from SQLite to PostgreSQL
"""

import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor
import os

from data_sources.database import DATABASE_URL # Import DATABASE_URL from new location

def get_sqlite_data():
    """Extract data from SQLite database"""
    try:
        # Connect to SQLite database
        sqlite_conn = sqlite3.connect('sql_app.db')
        sqlite_cursor = sqlite_conn.cursor()
        
        # Get categories
        sqlite_cursor.execute("SELECT * FROM categories")
        categories = sqlite_cursor.fetchall()
        
        # Get expenses
        sqlite_cursor.execute("SELECT * FROM expenses")
        expenses = sqlite_cursor.fetchall()
        
        sqlite_conn.close()
        
        print(f"📊 Found {len(categories)} categories and {len(expenses)} expenses in SQLite")
        return categories, expenses
        
    except Exception as e:
        print(f"❌ Error reading SQLite data: {e}")
        return [], []

def migrate_to_postgresql(categories, expenses):
    """Migrate data to PostgreSQL"""
    try:
        # Connect to PostgreSQL using the same connection string as database.py
        pg_conn = psycopg2.connect(DATABASE_URL)
        pg_cursor = pg_conn.cursor(cursor_factory=RealDictCursor)
        
        print("🔄 Migrating categories...")
        for category in categories:
            pg_cursor.execute(
                "INSERT INTO categories (id, name) VALUES (%s, %s) ON CONFLICT (id) DO NOTHING",
                (category[0], category[1])
            )
        
        print("🔄 Migrating expenses...")
        for expense in expenses:
            pg_cursor.execute(
                "INSERT INTO expenses (id, description, amount, date, category_id) VALUES (%s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING",
                (expense[0], expense[1], expense[2], expense[3], expense[4])
            )
        
        # Commit changes
        pg_conn.commit()
        print("✅ Migration completed successfully!")
        
        # Verify data
        pg_cursor.execute("SELECT COUNT(*) FROM categories")
        cat_count = pg_cursor.fetchone()[0]
        
        pg_cursor.execute("SELECT COUNT(*) FROM expenses")
        exp_count = pg_cursor.fetchone()[0]
        
        print(f"📊 PostgreSQL now contains {cat_count} categories and {exp_count} expenses")
        
        pg_conn.close()
        
    except Exception as e:
        print(f"❌ Error migrating to PostgreSQL: {e}")
        if 'pg_conn' in locals():
            pg_conn.rollback()
            pg_conn.close()

def main():
    """Main migration function"""
    print("🚀 Starting SQLite to PostgreSQL migration...")
    
    # Check if SQLite database exists
    if not os.path.exists('sql_app.db'):
        print("❌ SQLite database 'sql_app.db' not found")
        print("Make sure you're in the correct directory and the SQLite database exists")
        return
    
    # Extract data from SQLite
    categories, expenses = get_sqlite_data()
    
    if not categories and not expenses:
        print("❌ No data found to migrate")
        return
    
    # Migrate to PostgreSQL
    migrate_to_postgresql(categories, expenses)
    
    print("🎉 Migration process completed!")

if __name__ == "__main__":
    main()
