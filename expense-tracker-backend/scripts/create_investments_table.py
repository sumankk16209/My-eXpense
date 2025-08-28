#!/usr/bin/env python3
"""
Script to create the investments table in the database.
Run this after setting up the database and running migrations.
"""

import os
import sys
from sqlalchemy import create_engine, text

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_sources.database import DATABASE_URL

def create_investments_table():
    """Create the investments table if it doesn't exist."""
    
    # Get database URL
    database_url = DATABASE_URL
    print(f"Connecting to database: {database_url.split('@')[1] if '@' in database_url else database_url}")
    
    # Create engine
    engine = create_engine(database_url)
    
    try:
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful")
        
        # Create investments table
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS investments (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            investment_type VARCHAR NOT NULL,
            amount DECIMAL(15,2) NOT NULL,
            date DATE NOT NULL,
            status VARCHAR DEFAULT 'Active',
            description TEXT,
            institution VARCHAR,
            account_number VARCHAR,
            folio_number VARCHAR,
            units DECIMAL(15,4),
            nav DECIMAL(15,2),
            maturity_date DATE,
            interest_rate DECIMAL(5,2),
            frequency VARCHAR,
            is_sip BOOLEAN DEFAULT FALSE,
            sip_amount DECIMAL(15,2),
            sip_frequency VARCHAR,
            user_id INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """
        
        with engine.connect() as conn:
            conn.execute(text(create_table_sql))
            conn.commit()
            print("✅ Investments table created successfully")
        
        # Create indexes for better performance
        indexes_sql = [
            "CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_investments_type ON investments(investment_type);",
            "CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);",
            "CREATE INDEX IF NOT EXISTS idx_investments_date ON investments(date);",
            "CREATE INDEX IF NOT EXISTS idx_investments_maturity_date ON investments(maturity_date);"
        ]
        
        with engine.connect() as conn:
            for index_sql in indexes_sql:
                conn.execute(text(index_sql))
            conn.commit()
            print("✅ Investment table indexes created successfully")
        
        # Verify table creation
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name, column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'investments'
                ORDER BY ordinal_position;
            """))
            
            columns = result.fetchall()
            print("\n📋 Investments table structure:")
            print(f"{'Column':<20} {'Type':<20} {'Nullable':<10}")
            print("-" * 50)
            for col in columns:
                print(f"{col[1]:<20} {col[2]:<20} {col[3]:<10}")
        
        print("\n🎉 Investments table setup completed successfully!")
        
    except Exception as e:
        print(f"❌ Error creating investments table: {e}")
        sys.exit(1)
    finally:
        engine.dispose()

if __name__ == "__main__":
    print("🚀 Setting up investments table...")
    create_investments_table()
