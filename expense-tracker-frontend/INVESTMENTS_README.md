# 💰 Investment Portfolio Management System

## 🎯 Overview

The Investment Portfolio Management System is a comprehensive feature that allows users to track and manage various types of investments including SIP, Stocks, LIC, Mutual Funds, Fixed Deposits, and more. This system provides detailed portfolio analysis, performance tracking, and investment insights.

## 🚀 Features

### **Investment Types Supported**
- **SIP (Systematic Investment Plan)** - Monthly/Quarterly investments
- **Stocks** - Individual stock investments with units and price tracking
- **LIC (Life Insurance Corporation)** - Insurance policies and maturity tracking
- **Mutual Funds** - Fund investments with NAV and folio tracking
- **Fixed Deposits** - Bank FDs with interest rates and maturity dates
- **Gold** - Physical and digital gold investments
- **Real Estate** - Property investments
- **PPF (Public Provident Fund)** - Government savings scheme
- **NPS (National Pension System)** - Retirement planning
- **Bonds** - Government and corporate bonds
- **Other** - Custom investment categories

### **Core Functionality**
- **Portfolio Overview** - Total value, investment count, status breakdown
- **Investment Management** - Add, edit, delete, and view investments
- **Status Tracking** - Active, Paused, Completed, Sold, Matured
- **Performance Analysis** - Investment type breakdown, recent investments
- **Maturity Tracking** - Upcoming maturities with countdown
- **SIP Management** - Monthly SIP amounts and frequency tracking

## 🏗️ Architecture

### **Backend Components**
- **Models**: `Investment` model with comprehensive fields
- **Schemas**: Pydantic schemas for validation and API responses
- **API Endpoints**: Full CRUD operations for investments
- **Database**: PostgreSQL with optimized indexes

### **Frontend Components**
- **InvestmentForm**: Comprehensive form for adding/editing investments
- **InvestmentList**: Table view of all investments with actions
- **InvestmentSummary**: Portfolio overview with charts and insights
- **InvestmentsPage**: Main page with tabs for different views

## 📊 Database Schema

### **Investments Table**
```sql
CREATE TABLE investments (
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
```

### **Indexes for Performance**
- `idx_investments_user_id` - User-specific queries
- `idx_investments_type` - Investment type filtering
- `idx_investments_status` - Status-based queries
- `idx_investments_date` - Date-based sorting
- `idx_investments_maturity_date` - Maturity tracking

## 🔌 API Endpoints

### **Investment Management**
- `POST /investments/` - Create new investment
- `GET /investments/` - Get all investments for user
- `GET /investments/{id}` - Get specific investment
- `PUT /investments/{id}` - Update investment
- `DELETE /investments/{id}` - Delete investment

### **Portfolio Analytics**
- `GET /investments/summary` - Get portfolio summary and insights

## 🎨 User Interface

### **Portfolio Overview Tab**
- **Summary Cards**: Total value, investment count, active investments, SIP amount
- **Status Breakdown**: Visual representation of investment statuses
- **Recent Investments**: Latest 5 investments with details
- **Investment Types**: Breakdown by investment category
- **Upcoming Maturities**: Investments maturing soon with countdown

### **All Investments Tab**
- **Investment Table**: Comprehensive list with all details
- **Quick Actions**: Edit, delete, and view investment details
- **Status Indicators**: Color-coded status chips
- **Type Badges**: Investment type with color coding
- **SIP Indicators**: Shows SIP amounts for recurring investments

### **Investment Form**
- **Dynamic Fields**: Shows relevant fields based on investment type
- **Validation**: Comprehensive form validation with error messages
- **Type-Specific Fields**:
  - **SIP**: Amount and frequency
  - **Mutual Funds**: Folio number, units, NAV
  - **Stocks**: Units/shares, price per share
  - **Fixed Deposits**: Maturity date, interest rate

## 🚀 Getting Started

### **Backend Setup**
1. **Create Database Table**:
   ```bash
   cd expense-tracker-backend
   python3 create_investments_table.py
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Backend Server**:
   ```bash
   python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### **Frontend Setup**
1. **Install Dependencies**:
   ```bash
   cd expense-tracker-frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📱 Navigation

### **Access Routes**
- **Home Page**: Quick access section with "Manage Investments" button
- **Navigation Menu**: "Investments" link in main navigation
- **Direct URL**: `/investments` route

### **Navigation Flow**
- **Home** → Investment quick access section
- **Navigation** → Investments menu item
- **Investments Page** → Portfolio overview and management

## 🎯 Use Cases

### **Individual Investors**
- Track personal investment portfolio
- Monitor SIP investments and returns
- Plan for upcoming maturities
- Analyze investment distribution

### **Financial Planning**
- Portfolio diversification analysis
- Investment goal tracking
- Risk assessment by investment type
- Performance comparison

### **Tax Planning**
- Track investment dates for tax purposes
- Monitor maturity dates for tax implications
- Document investment details for tax filing

## 🔧 Configuration

### **Investment Types**
Investment types are configurable in the frontend and can be extended by:
1. Adding new types to the `InvestmentType` enum in `schemas.py`
2. Adding corresponding color schemes in components
3. Implementing type-specific form fields

### **Status Management**
Investment statuses include:
- **Active**: Currently active investments
- **Paused**: Temporarily paused investments
- **Completed**: Successfully completed investments
- **Sold**: Investments that have been sold
- **Matured**: Investments that have matured

## 📈 Future Enhancements

### **Planned Features**
- **Performance Tracking**: ROI calculations and charts
- **Goal Setting**: Investment goals and progress tracking
- **Alerts**: Maturity reminders and investment notifications
- **Reports**: Monthly/quarterly investment reports
- **Integration**: Connect with financial institutions for real-time data

### **Advanced Analytics**
- **Portfolio Optimization**: Asset allocation recommendations
- **Risk Analysis**: Investment risk assessment
- **Benchmarking**: Compare with market indices
- **Predictive Insights**: AI-powered investment recommendations

## 🛠️ Technical Details

### **Frontend Technologies**
- **React**: Component-based architecture
- **Material-UI**: Modern, responsive design system
- **Day.js**: Date manipulation and formatting
- **React Router**: Navigation and routing

### **Backend Technologies**
- **FastAPI**: High-performance API framework
- **SQLAlchemy**: Database ORM and management
- **PostgreSQL**: Robust relational database
- **Pydantic**: Data validation and serialization

### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Adaptive Layouts**: Responsive tables and forms
- **Touch-Friendly**: Large touch targets for mobile
- **Progressive Enhancement**: Works on all device sizes

## 🎨 Design System

### **Color Scheme**
- **Primary**: Blue (#1976d2) - Main actions and highlights
- **Secondary**: Purple (#9c27b0) - Secondary actions
- **Success**: Green (#2e7d32) - Active investments
- **Warning**: Orange (#ed6c02) - Paused investments
- **Error**: Red (#d32f2f) - Deleted/sold investments

### **Typography**
- **Headings**: Clear hierarchy with consistent sizing
- **Body Text**: Readable fonts with proper contrast
- **Labels**: Descriptive text for form fields
- **Status Text**: Color-coded status indicators

## 🔒 Security Features

### **Data Protection**
- **User Isolation**: Investments are user-specific
- **Authentication Required**: All investment operations require login
- **Input Validation**: Comprehensive form validation
- **SQL Injection Protection**: Parameterized queries

### **Access Control**
- **Ownership Verification**: Users can only access their own investments
- **Session Management**: Secure token-based authentication
- **Permission Checks**: Role-based access control (if implemented)

## 📊 Performance Optimization

### **Database Optimization**
- **Indexed Queries**: Fast lookups by user, type, and status
- **Efficient Joins**: Optimized relationships with users table
- **Query Optimization**: Minimal database calls for summary data

### **Frontend Optimization**
- **Lazy Loading**: Components load on demand
- **State Management**: Efficient state updates and refreshes
- **Caching**: Investment data caching for better performance

## 🧪 Testing

### **Test Coverage**
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing

### **Quality Assurance**
- **Code Review**: Peer review process
- **Automated Testing**: CI/CD pipeline integration
- **User Testing**: Real user feedback and validation

## 📚 Documentation

### **API Documentation**
- **OpenAPI/Swagger**: Interactive API documentation
- **Endpoint Examples**: Request/response examples
- **Error Codes**: Comprehensive error handling documentation

### **User Guides**
- **Getting Started**: Step-by-step setup guide
- **Feature Walkthrough**: Detailed feature explanations
- **Troubleshooting**: Common issues and solutions

## 🤝 Contributing

### **Development Guidelines**
- **Code Style**: Follow project coding standards
- **Documentation**: Update documentation with changes
- **Testing**: Include tests for new features
- **Review Process**: Submit pull requests for review

### **Feature Requests**
- **Issue Tracking**: Use GitHub issues for feature requests
- **Enhancement Ideas**: Submit enhancement proposals
- **Bug Reports**: Report bugs with detailed information

## 📄 License

This investment portfolio management system is part of the My eXpenses application and follows the same licensing terms.

## 🆘 Support

### **Getting Help**
- **Documentation**: Check this README and other project docs
- **Issues**: Search existing GitHub issues
- **Community**: Engage with the project community
- **Contact**: Reach out to project maintainers

---

**🎉 The Investment Portfolio Management System provides a comprehensive solution for tracking and managing investments, helping users build and monitor their financial portfolios effectively!**
