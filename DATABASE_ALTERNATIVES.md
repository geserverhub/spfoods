# 🛠️ Database Management Alternatives (ทดแทน phpMyAdmin)

Since phpMyAdmin requires Apache (which needs sudo), here are 3 working alternatives:

---

## **Solution 1: ✅ DBeaver (Best - Free Desktop GUI)**

### Download & Install
- **Website:** https://dbeaver.io/download/
- **Available for:** Windows, macOS, Linux
- **Size:** ~200MB (lightweight)

### Setup Steps
1. Download DBeaver (Community Edition is free)
2. Install and launch
3. Click **"Database" → "New Database Connection"**
4. Select **MySQL**
5. Fill in:
   ```
   Server Host:     localhost
   Port:            3306
   Username:        root
   Password:        spfoods2026
   Database:        spfoods
   ```
6. Click **"Test Connection"** ✅

### Features
- ✅ Manage databases visually
- ✅ Browse tables
- ✅ Run SQL queries
- ✅ Export/Import data
- ✅ User-friendly interface
- ✅ Works on Windows, macOS, Linux

---

## **Solution 2: ✅ MySQL Workbench**

### Download & Install
- **Website:** https://dev.mysql.com/downloads/workbench/
- **Available for:** Windows, macOS, Linux
- **Official MySQL tool**

### Setup Steps
1. Download MySQL Workbench
2. Install and open
3. Click **"+" button** to create new connection
4. Fill in same credentials as above
5. Click **"Test Connection"** ✅

### Features
- ✅ Official MySQL tool
- ✅ Query builder
- ✅ Database design tools
- ✅ Performance monitoring
- ✅ Database migration

---

## **Solution 3: ✅ Command Line (Terminal CLI)**

### Quick Database Access
```bash
# Connect to database
mysql -h localhost -u root -pspfoods2026 spfoods

# Once connected, you can run:
SHOW TABLES;
SELECT * FROM admin_users;
SELECT * FROM registrations;
SELECT * FROM orders;
SELECT * FROM departments;

# Edit users
UPDATE admin_users SET password_hash = 'new_hash' WHERE id = 1;

# View single table
DESC admin_users;
```

### Useful MySQL Commands
```bash
# Show all databases
SHOW DATABASES;

# Use specific database
USE spfoods;

# Show all tables
SHOW TABLES;

# Show table structure
DESC table_name;

# Count records
SELECT COUNT(*) FROM table_name;

# Export data
SELECT * FROM table_name INTO OUTFILE '/tmp/export.csv' FIELDS TERMINATED BY ',';

# Exit MySQL
EXIT;
```

---

## **Solution 4: ✅ Node.js Web UI (Quick Alternative)**

If you want a web-based UI without phpMyAdmin, you can use **adminer.php** or **HeidiSQL** web version.

### Quick setup with npm
```bash
# Install a simple database browser
npm install -g mysql-client

# Or use this Node.js admin tool
npm install -g db-admin
```

---

## **Solution 5: ✅ VS Code Extension**

### Setup in VS Code
1. Open VS Code
2. Go to **Extensions** (Ctrl+Shift+X)
3. Search for **"MySQL"** or **"Database Client"**
4. Install one of these:
   - **MySQL** by cweijan
   - **SQL Server Client** by Weijan Chen
5. Click the database icon in left sidebar
6. Add connection with:
   ```
   Host: localhost
   Port: 3306
   User: root
   Password: spfoods2026
   Database: spfoods
   ```

### Features
- ✅ View tables in VS Code
- ✅ Run SQL queries
- ✅ See results inline
- ✅ No extra software needed

---

## **My Recommendation 🎯**

### For Best Experience:
1. **DBeaver** - Most user-friendly, works everywhere
2. **MySQL Workbench** - Official, powerful
3. **VS Code Extension** - If you live in VS Code

### For Quick Access:
- **Terminal CLI** - Fastest, no installation needed
- **VS Code Extension** - Built-in solution

---

## **Complete Connection Details**

```
Database Name:  spfoods
Host:          localhost
Port:          3306
Username:      root
Password:      spfoods2026
Charset:       utf8mb4
```

### Tables Available
1. **admin_users** - Admin user accounts
2. **registrations** - User registrations
3. **orders** - Order tracking data
4. **departments** - Company departments

---

## **Testing Connection from Command Line**

```bash
# Quick test
mysql -h localhost -u root -pspfoods2026 -e "SELECT DATABASE();"

# Result should show: spfoods
```

---

**Choose one solution above and get started! 🚀**
