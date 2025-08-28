.PHONY: all backend frontend

all: backend frontend

backend:
	@echo "Starting FastAPI backend..."
	rm -f expense-tracker-backend/sql_app.db
	PYTHONPATH=./ uvicorn expense-tracker-backend.main:app --reload

frontend:
	@echo "Starting React frontend..."
	cd expense-tracker-frontend && npm run dev
