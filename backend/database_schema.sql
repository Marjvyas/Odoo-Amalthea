-- Add these tables to your existing expense_tracker database

-- Table for storing expense submissions
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL,
    receipt_url VARCHAR(500),
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    rejection_reason VARCHAR(500),
    rejected_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Table for manager-employee relationships
CREATE TABLE manager_relationships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    manager_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id),
    FOREIGN KEY (manager_id) REFERENCES users(id),
    UNIQUE KEY unique_employee_manager (employee_id, manager_id)
);

-- Add manager_id column to users table for direct manager assignment
ALTER TABLE users ADD COLUMN manager_id INT;
ALTER TABLE users ADD FOREIGN KEY (manager_id) REFERENCES users(id);

-- Update users table to have pending role initially
ALTER TABLE users MODIFY COLUMN role ENUM('Admin', 'Manager', 'Employee', 'Pending') DEFAULT 'Pending';

-- Table for expense approvals (for multi-level approval workflow)
CREATE TABLE expense_approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    approver_id INT NOT NULL,
    approval_order INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_at TIMESTAMP NULL,
    rejection_reason VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (approver_id) REFERENCES users(id)
);