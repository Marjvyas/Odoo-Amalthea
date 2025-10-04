# 💼 ExpenseFlow - Smart Expense Management System

ExpenseFlow is a comprehensive, role-based expense management platform designed to streamline corporate expense reimbursement processes. Built with React and Node.js, it features multi-level approval workflows, OCR receipt scanning, and automated expense tracking.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with role management
- **Role-Based Access Control**: Admin, Manager, and Employee roles with specific permissions
- **Expense Submission**: Easy expense form with receipt upload and OCR simulation
- **Multi-Level Approvals**: Hierarchical approval workflows based on user roles
- **Real-Time Dashboard**: Comprehensive overview of expenses, approvals, and statistics
- **Receipt Management**: File upload with support for JPEG, PNG, and PDF formats

### User Roles & Permissions

#### 🔑 Admin
- Assign roles to newly registered users
- View and manage all users across the organization
- Approve/reject any expense regardless of amount
- Access complete system analytics and reports
- Manage company settings and configurations

#### 👨‍💼 Manager  
- Approve/reject expenses from team members
- View team expense statistics and reports
- Submit own expenses for approval
- Manage direct reports and their expense limits

#### 👤 Employee
- Submit expense claims with receipt uploads
- Track personal expense history and status
- View approval workflows and rejection reasons
- Update personal profile and settings

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - Modern UI library with hooks
- **React Router DOM 7.9.3** - Client-side routing
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with gradients and animations
- **Vite 7.1.7** - Fast development build tool

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MySQL2 3.15.1** - Database connectivity
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 3.0.2** - Password hashing
- **Multer** - File upload middleware
- **Express Validator** - Input validation and sanitization

### Database
- **MySQL** - Relational database management system
- **expense_tracker** database with comprehensive schema

## 📋 Prerequisites

Before running ExpenseFlow, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MySQL** (v8.0 or higher)
- **Git** (for version control)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/odoo-amalthea.git
cd odoo-amalthea/Odoo-Amalthea
```

### 2. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE expense_tracker;
USE expense_tracker;
```

#### Run Database Schema
Execute the SQL commands from `backend/database_schema.sql`:
```bash
mysql -u your_username -p expense_tracker < backend/database_schema.sql
```

The schema includes:
- `companies` table - Company information
- `users` table - User accounts with role management
- `expenses` table - Expense records with approval workflow
- `manager_relationships` table - Hierarchical user management
- `expense_approvals` table - Multi-level approval tracking

### 3. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create a `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 4. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🗃 Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Manager', 'Employee', 'Pending') DEFAULT 'Pending',
    company_id INT,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_assigned_at TIMESTAMP NULL,
    assigned_by INT,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (manager_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);
```

#### Expenses Table
```sql
CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500),
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT,
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /login` - User login with email/password
- `POST /signup` - User registration with company creation

### User Management Routes (`/api/users`)
- `GET /pending-roles` - Get users awaiting role assignment (Admin only)
- `PUT /:id/assign-role` - Assign role to user (Admin only)
- `GET /all` - Get all users (Admin/Manager view)
- `GET /managers` - Get list of managers for role assignment
- `PUT /profile` - Update user profile

### Expense Routes (`/api/expenses`)
- `POST /submit` - Submit new expense with receipt upload
- `GET /my-expenses` - Get user's expense history
- `GET /pending-approvals` - Get expenses pending approval (Manager/Admin)
- `PUT /:id/approve` - Approve or reject expense
- `GET /stats` - Get expense statistics for dashboard

### System Routes
- `GET /api/health` - Health check endpoint

## 🎨 User Interface

### Design Philosophy
- **Modern Gradient Design**: Beautiful CSS3 gradients and animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Intuitive Navigation**: Role-based sidebar navigation
- **Card-Based UI**: Clean, organized information display
- **Interactive Elements**: Hover effects and smooth transitions

### Page Structure

#### 🏠 Dashboard
- Expense statistics overview
- Recent expense submissions
- Quick action buttons
- Pending approvals (for Managers/Admins)

#### ➕ Expense Submission
- Comprehensive expense form
- Receipt upload with drag-and-drop
- OCR simulation for receipt scanning
- Category selection and notes

#### 📋 My Expenses
- Filterable expense history
- Status tracking (Pending, Approved, Rejected)
- Detailed expense cards with receipts
- Search and sort functionality

#### 👑 Role Assignment (Admin Only)
- View users with pending role assignments
- Assign Employee, Manager, or Admin roles
- Manager relationship management
- Real-time role updates

#### ⚙️ Settings
- Multi-tab settings interface
- Profile management
- Notification preferences
- Account security settings

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with secure tokens
- **Input Validation**: Server-side validation using express-validator
- **File Upload Security**: Restricted file types and size limits
- **Role-Based Authorization**: Endpoint protection based on user roles
- **SQL Injection Prevention**: Parameterized queries with MySQL2

## 🚦 Getting Started

### First Time Setup

1. **Register as First User**: Visit `/register` to create your account
2. **Database Initialization**: The first registered user should be manually set as Admin in the database
3. **Role Assignment**: Use the Role Assignment page to assign roles to new users
4. **Team Setup**: Create Manager-Employee relationships through the admin panel
5. **Expense Workflow**: Start submitting and approving expenses

### Sample Workflow

1. **Employee** submits an expense with receipt
2. **Manager** receives notification and reviews expense
3. **Manager** approves/rejects with optional comments
4. **Employee** receives status update and reimbursement processing begins
5. **Admin** can override any decision and view system-wide analytics

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total expenses submitted
- Approval rates by category
- Average processing time
- Monthly/quarterly trends
- Department-wise breakdowns

### Manager Reports
- Team expense summaries
- Individual employee patterns
- Approval decision tracking
- Budget variance analysis

### Admin Analytics
- Company-wide expense trends
- User adoption metrics
- System usage statistics
- Audit trail reporting

## 📱 Responsive Design

ExpenseFlow is built with mobile-first principles:

- **Mobile Devices**: Optimized touch interfaces and compact layouts
- **Tablets**: Balanced view with accessible navigation
- **Desktop**: Full-featured dashboard with multiple data views
- **Cross-Browser**: Compatible with Chrome, Firefox, Safari, and Edge

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with company creation
- [ ] User login with valid credentials
- [ ] Token persistence across browser sessions
- [ ] Automatic logout on token expiration

#### Role Management
- [ ] Admin can view pending users
- [ ] Role assignment functionality
- [ ] Manager relationship setup
- [ ] Permission-based page access

#### Expense Management
- [ ] Expense submission with file upload
- [ ] Expense history viewing and filtering
- [ ] Approval workflow for managers
- [ ] Status updates and notifications

## 🔄 Future Enhancements

### Planned Features
- **Email Notifications**: Automated email alerts for expense status changes
- **Mobile App**: React Native mobile application
- **Advanced OCR**: Real OCR integration with receipt parsing
- **Budget Management**: Department and project budget tracking
- **Integration APIs**: Connect with accounting software (QuickBooks, SAP)
- **Advanced Analytics**: Machine learning for expense pattern analysis
- **Multi-Currency**: Support for international expense submissions
- **Audit Trail**: Comprehensive logging and compliance reporting

### Technical Improvements
- **Testing Suite**: Jest and Cypress test implementation
- **Docker Support**: Containerization for easy deployment
- **CI/CD Pipeline**: GitHub Actions for automated deployment
- **Performance Optimization**: Lazy loading and code splitting
- **Accessibility**: WCAG 2.1 compliance for screen readers

## 🤝 Contributing

We welcome contributions to ExpenseFlow! Please follow these guidelines:

1. **Fork the Repository**: Create your own fork of the codebase
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**: Submit your changes for review

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex business logic
- Update documentation for new features
- Test thoroughly before submitting PRs

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running and credentials in `.env` are correct

#### JWT Token Invalid
```bash
Error: jwt malformed
```
**Solution**: Clear localStorage and re-login to get fresh token

#### File Upload Issues
```bash
Error: LIMIT_FILE_SIZE
```
**Solution**: Check file size limits (max 5MB) and allowed file types

#### Port Already in Use
```bash
Error: listen EADDRINUSE :::5000
```
**Solution**: Kill process using port or change PORT in `.env`

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👥 Team

ExpenseFlow is developed and maintained by passionate developers committed to simplifying expense management for businesses of all sizes.

## 📞 Support

For support, email support@expenseflow.com or create an issue in the GitHub repository.

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/your-username/odoo-amalthea.git
cd odoo-amalthea/Odoo-Amalthea

# Backend setup
cd backend
npm install
# Configure .env file
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

**Ready to revolutionize your expense management? Start with ExpenseFlow today! 💼✨**