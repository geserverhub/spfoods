# 🗄️ SP FOODS - Database Schema with PK & FK (Primary & Foreign Keys)

## 📊 Complete Database Structure

### **Current Status**: ⚠️ FK relationships missing in tables

---

## 🎯 Updated Schema (With Proper PK & FK)

### **1. admin_users** (ผู้ดูแลระบบ)
```sql
CREATE TABLE admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('superadmin','admin','manager') DEFAULT 'admin',
  dept_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_username ON admin_users(username);
CREATE INDEX idx_dept_id ON admin_users(dept_id);
```

### **2. departments** (แผนก)
```sql
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dept_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  employee_count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE UNIQUE INDEX idx_dept_id ON departments(dept_id);
CREATE INDEX idx_sort_order ON departments(sort_order);
```

### **3. employees** (พนักงาน) - NEW TABLE
```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  emp_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  position VARCHAR(100),
  dept_id VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  status ENUM('active','inactive','leave') DEFAULT 'active',
  hire_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_dept_id ON employees(dept_id);
CREATE INDEX idx_emp_id ON employees(emp_id);
CREATE INDEX idx_status ON employees(status);
```

### **4. registrations** (ผู้ลงทะเบียน)
```sql
CREATE TABLE registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(200),
  address TEXT NOT NULL,
  purpose ENUM('income','partner','buy','distributor','other') NOT NULL,
  assigned_dept_id VARCHAR(50),
  status ENUM('new','processing','contacted','done') DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_purpose ON registrations(purpose);
CREATE INDEX idx_status ON registrations(status);
CREATE INDEX idx_dept_id ON registrations(assigned_dept_id);
CREATE INDEX idx_created_at ON registrations(created_at);
```

### **5. orders** (ใบสั่งการจัดส่ง)
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  item VARCHAR(500) NOT NULL,
  status ENUM('packing','shipping','delivered','cancelled') DEFAULT 'packing',
  location VARCHAR(500) DEFAULT 'กำลังเตรียมพัสดุ',
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE UNIQUE INDEX idx_order_id ON orders(order_id);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_assigned_to ON orders(assigned_to);
CREATE INDEX idx_created_at ON orders(created_at);
```

### **6. invoices** (ใบแจ้งหนี้) - NEW TABLE
```sql
CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id VARCHAR(50) UNIQUE NOT NULL,
  registration_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('draft','sent','paid','overdue','cancelled') DEFAULT 'draft',
  issue_date DATE,
  due_date DATE,
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_registration_id ON invoices(registration_id);
CREATE INDEX idx_status ON invoices(status);
CREATE INDEX idx_issue_date ON invoices(issue_date);
```

### **7. stock** (สต๊อกสินค้า) - NEW TABLE
```sql
CREATE TABLE stock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_code VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity_in_stock INT DEFAULT 0,
  quantity_min_alert INT DEFAULT 10,
  dept_id VARCHAR(50),
  unit VARCHAR(50),
  price_per_unit DECIMAL(10,2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_product_code ON stock(product_code);
CREATE INDEX idx_dept_id ON stock(dept_id);
```

### **8. delivery_tracking** (ติดตามการจัดส่ง) - NEW TABLE
```sql
CREATE TABLE delivery_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status ENUM('packing','ready','shipped','in-transit','delivered','failed') DEFAULT 'packing',
  location VARCHAR(500),
  notes TEXT,
  updated_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES employees(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes
CREATE INDEX idx_order_id ON delivery_tracking(order_id);
CREATE INDEX idx_status ON delivery_tracking(status);
```

---

## 🔗 Relationship Diagram

```
admin_users
    ↓ (dept_id)
departments
    ↓ (dept_id)
employees
    ↑ (id)
    └─ orders (assigned_to)
    └─ delivery_tracking (updated_by)

registrations
    ↓ (assigned_dept_id)
departments
    ↑ (id)
    └─ invoices (registration_id)

stock
    ↓ (dept_id)
departments
```

---

## 📋 Admin Dashboard Modules & Database Connections

### **🏭 แผนกผลิต (Production)**
| Menu Item | API Endpoint | Table | FK Connection |
|-----------|--------------|-------|--------|
| ข้อมูลพนักงาน | `/api/employees?dept=production` | employees | dept_id |
| สต๊อกวัตถุดิบ | `/api/stock?dept=production` | stock | dept_id |
| ใบสั่งการผลิต | `/api/orders?dept=production` | orders | assigned_to |

### **💰 แผนกบัญชี (Accounting)**
| Menu Item | API Endpoint | Table | FK Connection |
|-----------|--------------|-------|--------|
| รายรับ-รายจ่าย | `/api/accounting/ledger` | invoices | registration_id |
| ใบแจ้งหนี้ | `/api/invoices` | invoices | registration_id |
| ลูกหนี้ | `/api/registrations?status=all` | registrations | assigned_dept_id |

### **🛒 แผนกธุรการ (Administration)**
| Menu Item | API Endpoint | Table | FK Connection |
|-----------|--------------|-------|--------|
| ผู้ลงทะเบียน | `/api/registrations` | registrations | assigned_dept_id |
| สต๊อกสินค้า | `/api/stock?dept=admin` | stock | dept_id |
| เอกสารการสั่งซื้อ | `/api/orders` | orders | id |

### **🚚 แผนกติดต่องานภายนอก (Delivery)**
| Menu Item | API Endpoint | Table | FK Connection |
|-----------|--------------|-------|--------|
| การจัดส่ง | `/api/orders?status=shipping` | orders | assigned_to |
| ติดตามพัสดุ | `/api/delivery-tracking` | delivery_tracking | order_id |
| พนักงานขนส่ง | `/api/employees?dept=delivery` | employees | dept_id |

### **🧪 แผนกควบคุมคุณภาพ (QC)**
| Menu Item | API Endpoint | Table | FK Connection |
|-----------|--------------|-------|--------|
| ตรวจสอบคุณภาพ | `/api/orders?status=packing` | orders | id |
| สต๊อก R&D | `/api/stock?dept=qc` | stock | dept_id |
| รายงาน QA | `/api/qc-reports` | orders | id |

### **📊 แผนกขาย (Sales)**
| Menu Item | API Endpoint | Table | FK Connection |
|-----------|--------------|-------|--------|
| ข้อมูลลูกค้า | `/api/registrations?purpose=buy` | registrations | id |
| ใบสั่งขาย | `/api/orders` | orders | id |
| รายงานยอดขาย | `/api/sales-report` | invoices | registration_id |

### **👨‍💼 เจ้าของกิจการ (Owner/Director) - Full Access**
| Menu Item | API Endpoint | Tables |
|-----------|--------------|--------|
| ข้อมูลพนักงานทั้งหมด | `/api/employees` | employees |
| ผู้ลงทะเบียนทั้งหมด | `/api/registrations` | registrations |
| ใบแจ้งหนี้ | `/api/invoices` | invoices |
| สต๊อกสินค้า | `/api/stock` | stock |
| การจัดส่ง | `/api/delivery-tracking` | delivery_tracking |
| รายรับ-รายจ่าย | `/api/accounting/ledger` | invoices |
| ลูกค้า/ลูกหนี้ | `/api/registrations` | registrations |
| รายงานสรุป | `/api/reports/summary` | All tables |

---

## 🛠️ Setup Script

```sql
-- Run this to create all tables with proper PK & FK

USE spfoods;

-- Drop old tables (if needed)
-- DROP TABLE IF EXISTS delivery_tracking;
-- DROP TABLE IF EXISTS stock;
-- DROP TABLE IF EXISTS invoices;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS employees;
-- DROP TABLE IF EXISTS registrations;
-- DROP TABLE IF EXISTS admin_users;
-- DROP TABLE IF EXISTS departments;

-- Create departments (Master table)
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dept_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  employee_count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  dept_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
  INDEX idx_username (username),
  INDEX idx_dept_id (dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create employees
CREATE TABLE IF NOT EXISTS employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  emp_id VARCHAR(50) UNIQUE,
  name VARCHAR(200) NOT NULL,
  dept_id VARCHAR(50) NOT NULL,
  position VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  status ENUM('active','inactive','leave') DEFAULT 'active',
  hire_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE,
  INDEX idx_dept_id (dept_id),
  INDEX idx_emp_id (emp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create registrations
CREATE TABLE IF NOT EXISTS registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company VARCHAR(200),
  address TEXT NOT NULL,
  purpose VARCHAR(50) NOT NULL,
  assigned_dept_id VARCHAR(50),
  status ENUM('new','processing','contacted','done') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
  INDEX idx_purpose (purpose),
  INDEX idx_status (status),
  INDEX idx_dept_id (assigned_dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create orders
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  item VARCHAR(500) NOT NULL,
  status ENUM('packing','shipping','delivered','cancelled') DEFAULT 'packing',
  location VARCHAR(500) DEFAULT 'กำลังเตรียมพัสดุ',
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES employees(id) ON DELETE SET NULL,
  UNIQUE INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create invoices
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id VARCHAR(50) UNIQUE NOT NULL,
  registration_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('draft','sent','paid','overdue','cancelled') DEFAULT 'draft',
  issue_date DATE,
  due_date DATE,
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_invoice_id (invoice_id),
  INDEX idx_registration_id (registration_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create stock
CREATE TABLE IF NOT EXISTS stock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_code VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity_in_stock INT DEFAULT 0,
  quantity_min_alert INT DEFAULT 10,
  dept_id VARCHAR(50),
  unit VARCHAR(50),
  price_per_unit DECIMAL(10,2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
  INDEX idx_product_code (product_code),
  INDEX idx_dept_id (dept_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create delivery_tracking
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status ENUM('packing','ready','shipped','in-transit','delivered','failed') DEFAULT 'packing',
  location VARCHAR(500),
  notes TEXT,
  updated_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES employees(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert test data
INSERT IGNORE INTO departments (dept_id, title, employee_count, sort_order) VALUES
('production', 'แผนกผลิตและดูแลพนักงานต่างชาติ', 12, 1),
('accounting', 'แผนกบัญชีภาษีและลูกหนี้', 5, 2),
('admin', 'แผนกธุรการขาย-ซื้อ', 8, 3),
('delivery', 'แผนกติดต่องานภายนอกและจัดส่ง', 10, 4),
('qc', 'แผนกควบคุมคุณภาพและR&D', 6, 5),
('sales', 'แผนกขายและการตลาด', 9, 6);

SHOW TABLES;
```

---

## ✅ Database Check Commands

```bash
# View all tables
mysql -h localhost -u root -pspfoods2026 spfoods -e "SHOW TABLES;"

# Check structure of each table
mysql -h localhost -u root -pspfoods2026 spfoods -e "DESC employees;"
mysql -h localhost -u root -pspfoods2026 spfoods -e "DESC orders;"
mysql -h localhost -u root -pspfoods2026 spfoods -e "DESC invoices;"

# Check FK relationships
mysql -h localhost -u root -pspfoods2026 spfoods -e "SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA='spfoods' AND REFERENCED_TABLE_NAME IS NOT NULL;"
```

---

**ข้อสังเกต:**
- ✅ ทุก FK มีการเชื่อมโยงอย่างถูกต้อง
- ✅ ทุก PK เป็นแบบ AUTO_INCREMENT
- ✅ มี Indexes สำหรับ performance
- ✅ มี ON DELETE CASCADE/SET NULL เพื่อรักษาข้อมูล
- ✅ Character set utf8mb4 สำหรับ 6 ภาษา
