# Expense Tracker Backend

A FastAPI-based backend for expense tracking with PostgreSQL database and Alembic migrations.

## Features

- **FastAPI**: Modern, fast web framework for building APIs
- **PostgreSQL**: Robust, production-ready database
- **Alembic**: Database migration and version control
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations

## Prerequisites

- Python 3.8+
- Docker and Docker Compose
- PostgreSQL (can be run via Docker)

## Quick Start

### 1. Install Dependencies

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Start PostgreSQL Database

```bash
# Start PostgreSQL using Docker Compose
make db-up

# Or manually:
docker-compose up -d postgres
```

### 3. Initialize Database

```bash
# Initialize database and create first migration
make init-db

# This will:
# - Test database connection
# - Create initial migration
# - Apply migration to create tables
```

### 4. Run the Application

```bash
# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Database Management

### Available Make Commands

```bash
make help                    # Show all available commands
make db-up                  # Start PostgreSQL
make db-down                # Stop PostgreSQL
make db-reset               # Reset database (removes all data)
make migrate                # Show current migration status
make migrate-upgrade        # Apply all pending migrations
make migrate-downgrade      # Downgrade to previous migration
make migrate-autogenerate   # Auto-generate migration from model changes
make init-db                # Initialize database and create first migration
make clean                  # Clean up generated files
```

### Manual Alembic Commands

```bash
# Show current migration status
alembic current

# Show migration history
alembic history

# Create a new migration
alembic revision -m "Description of changes"

# Auto-generate migration from model changes
alembic revision --autogenerate -m "Auto-generated migration"

# Apply migrations
alembic upgrade head

# Downgrade migrations
alembic downgrade -1

# Downgrade to specific revision
alembic downgrade <revision_id>
```

## Environment Variables

The following environment variables can be set:

- `DATABASE_URL`: PostgreSQL connection string
  - Default: `postgresql://postgres:password@localhost:5432/expense_tracker`

## Database Schema

### Tables

- **categories**: Expense categories (Food, Transportation, Housing, etc.)
- **expenses**: Individual expense records with amounts, dates, and categories

### Relationships

- Each expense belongs to one category
- Categories can have multiple expenses

## Development Workflow

### Making Database Changes

1. **Modify Models**: Update `models.py` with your changes
2. **Generate Migration**: `make migrate-autogenerate`
3. **Review Migration**: Check the generated migration file in `alembic/versions/`
4. **Apply Migration**: `make migrate-upgrade`
5. **Test**: Verify your changes work correctly

### Example Workflow

```bash
# 1. Make changes to models.py
# 2. Generate migration
make migrate-autogenerate

# 3. Review the generated file in alembic/versions/
# 4. Apply the migration
make migrate-upgrade

# 5. Test your changes
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running: `make db-up`
   - Check connection string in `database.py`

2. **Migration Errors**
   - Check migration files in `alembic/versions/`
   - Use `alembic current` to see current state
   - Use `alembic history` to see migration history

3. **Port Already in Use**
   - Change port in `uvicorn` command
   - Or stop existing process using the port

### Reset Everything

```bash
# Stop and remove all data
make db-reset

# Reinitialize database
make init-db
```

## Production Considerations

- Set `echo=False` in database engine configuration
- Use environment variables for database credentials
- Consider using connection pooling for production loads
- Set up proper backup and monitoring for PostgreSQL

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
