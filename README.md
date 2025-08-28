# My eXpenses - Expense Tracking Application

A comprehensive expense tracking application with AI-powered forecasting capabilities, built with FastAPI backend and React frontend.

## 🚀 Features

- **Expense Management**: Track daily expenses with categories and descriptions
- **AI Forecasting**: Machine learning-powered expense predictions
- **Investment Tracking**: Monitor investments and portfolio performance
- **User Authentication**: Secure login and registration system
- **Category Management**: Customizable expense categories
- **Data Visualization**: Interactive charts and reports
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Architecture

- **Backend**: FastAPI with PostgreSQL database
- **Frontend**: React with Vite
- **AI/ML**: Python-based forecasting models
- **Database**: PostgreSQL with Alembic migrations
- **Documentation**: MkDocs with Material theme

## 📁 Project Structure

```
My eXpenses/
├── expense-tracker-backend/     # FastAPI backend
│   ├── api/                    # API endpoints
│   ├── data_sources/          # Database models and connections
│   ├── logic/                 # Business logic
│   ├── models/                # Data models
│   ├── routers/               # Route handlers
│   ├── schema/                # Pydantic schemas
│   ├── scripts/               # Database scripts
│   └── docs/                  # Documentation
├── expense-tracker-frontend/   # React frontend
│   ├── src/                   # Source code
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   └── contexts/              # React contexts
└── Makefile                   # Project management
```

## 🛠️ Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Docker (optional)

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd expense-tracker-backend
   ```

2. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your database credentials
   ```

5. **Start database:**
   ```bash
   make db-up
   ```

6. **Initialize database:**
   ```bash
   make init-db
   ```

7. **Run the application:**
   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd expense-tracker-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📚 Documentation

### Build Documentation
```bash
cd expense-tracker-backend
make docs-build
```

### Serve Documentation Locally
```bash
cd expense-tracker-backend
make docs-serve-8080  # Serves on port 8080
```

## 🗄️ Database Management

- **View migration status:** `make migrate`
- **Apply migrations:** `make migrate-upgrade`
- **Create migration:** `make migrate-revision`
- **Auto-generate migration:** `make migrate-autogenerate`

## 🐳 Docker Support

```bash
cd expense-tracker-backend
docker-compose up -d
```

## 🔧 Available Make Commands

```bash
make help                    # Show all available commands
make db-up                   # Start PostgreSQL database
make db-down                 # Stop PostgreSQL database
make db-reset                # Reset database (removes all data)
make init-db                 # Initialize database and create first migration
make migrate                 # Show current migration status
make migrate-upgrade         # Apply all pending migrations
make migrate-downgrade       # Downgrade to previous migration
make migrate-revision        # Create a new migration file
make migrate-autogenerate    # Auto-generate migration from model changes
make clean                   # Clean up generated files
make docs-build              # Build documentation into static site
make docs-serve-8080        # Serve documentation on port 8080
```

## 🌐 API Endpoints

- **Authentication**: `/auth/login`, `/auth/register`
- **Expenses**: `/expenses/`, `/expenses/{id}`
- **Categories**: `/categories/`, `/categories/{id}`
- **Investments**: `/investments/`, `/investments/{id}`
- **AI Forecasting**: `/ai/forecast`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Budget planning features
- [ ] Export/import functionality
- [ ] API rate limiting
- [ ] Performance optimizations
