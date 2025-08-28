.PHONY: help db-up db-down db-reset migrate migrate-upgrade migrate-downgrade migrate-revision migrate-autogenerate init-db migrate-from-sqlite clean docs-serve docs-serve-8080 docs-build

help: ## Show this help message
	@echo "Expense Tracker Database Management"
	@echo "=================================="
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

db-up: ## Start PostgreSQL database
	docker-compose up -d postgres
	@echo "⏳ Waiting for database to be ready..."
	@sleep 5
	@echo "✅ PostgreSQL is running on localhost:5432"

db-down: ## Stop PostgreSQL database
	docker-compose down
	@echo "✅ PostgreSQL stopped"

db-reset: ## Reset PostgreSQL database (removes all data)
	docker-compose down -v
	docker-compose up -d postgres
	@sleep 5
	@echo "✅ Database reset complete"

migrate: ## Show current migration status
	alembic current

migrate-upgrade: ## Apply all pending migrations
	alembic upgrade head

migrate-downgrade: ## Downgrade to previous migration
	alembic downgrade -1

migrate-revision: ## Create a new migration file
	@read -p "Enter migration message: " message; \
	alembic revision -m "$$message"

migrate-autogenerate: ## Auto-generate migration from model changes
	alembic revision --autogenerate -m "Auto-generated migration"

init-db: ## Initialize database and create first migration
	@echo "🚀 Initializing database..."
	python3 scripts/init_db.py
	@echo "📝 Creating initial migration..."
	alembic revision --autogenerate -m "Initial migration"
	@echo "⬆️ Applying migration..."
	alembic upgrade head
	@echo "✅ Database initialization complete!"

migrate-from-sqlite: ## Migrate data from existing SQLite database
	@echo "🔄 Migrating data from SQLite to PostgreSQL..."
	python3 scripts/migrate_from_sqlite.py
	@echo "✅ Migration script completed!"

clean: ## Clean up generated files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	@echo "🧹 Cleanup complete"

docs-serve-8080: ## Serve documentation locally on port 8080
	@echo "📖 Serving documentation on port 8080..."
	mkdocs serve -f mkdocs.yml -a localhost:8080

docs-build: ## Build documentation into static site
	@echo "📦 Building documentation..."
	mkdocs build -f mkdocs.yml
	@echo "✅ Documentation built to 'site/' directory"
